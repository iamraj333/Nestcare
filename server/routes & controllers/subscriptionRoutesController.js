const express = require('express')
const TokenAuthMiddleware = require('../middleware/TokenAuthMiddleware')
const Subscription = require('../models/Subscription')
const SubscriptionPlan = require('../models/SubscriptionPlan')
const Payment = require('../models/Payment')
const razorpay = require('../config/Razorpay.js')
const crypto = require('crypto')

const SubscriptionRouter = express.Router()

SubscriptionRouter.get('/my', TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "customer") {
        return res.status(403).json({ error: "Access denied!" });
    }

    try {
        const subscriptions = await Subscription.find({
            customer: req.user._id
        })
            .populate('plan')
            .populate('payment')
            .sort({ createdAt: -1 });

        const currentDate = new Date();

        for (const subscription of subscriptions) {
            if (
                subscription.status === "active" &&
                subscription.endDate < currentDate
            ) {
                subscription.status = "expired";
                await subscription.save();
            }
        }

        const activeSubscriptions = subscriptions.filter(
            subscription => subscription.status === "active"
        );

        res.status(200).json({
            success: "fetch successful",
            subscriptionData: activeSubscriptions
        });
    } catch (e) {
        console.error("Failed to fetch subscription data:", e);
        res.status(500).json({
            error: "Server failed to fetch subscription data"
        });
    }
});


//CREATE PAYMENT ORDER using RAZORPY Gateway
SubscriptionRouter.post('/create-order', TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "customer") {
        return res.status(403).json({ error: "Access denied" })
    }
    try {
        const { planId } = req.body
        if (!planId) {
            return res.status(400).json({ error: "Plan ID is required" })
        }
        const plan = await SubscriptionPlan.findOne({ _id: planId, isActive: true })
        if (!plan) {
            return res.status(404).json({ error: "Plan not found" })
        }
        const activeSubscription = await Subscription.findOne({
            customer: req.user._id,
            status: "active",
            endDate: { $gt: new Date() }
        })
        if (activeSubscription) {
            return res.status(400).json({ error: "You already have an active subscription" })
        }
        const order = await razorpay.orders.create({
            amount: Math.round(plan.price * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                customerId: req.user._id.toString(),
                planId: plan._id.toString()
            }
        })
        res.status(201).json({
            success: "Razorpay order created",
            order,
            key: process.env.RAZORPAY_API_KEY
        })
    } catch (e) {
        console.error("Failed to create Razorpay order:", e)
        res.status(500).json({ error: "Failed to create payment order" })
    }
})


//PAYMENT VERIFICATION
SubscriptionRouter.post('/verify-payment', TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "customer") {
        return res.status(403).json({ error: "Access denied" })
    }
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
            return res.status(400).json({ error: "Payment details are required" })
        }

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid payment signature" })
        }

        const existingPayment = await Payment.findOne({
            transactionId: razorpay_payment_id
        })

        if (existingPayment) {
            return res.status(409).json({ error: "Payment already processed" })
        }

        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id)
        const order = await razorpay.orders.fetch(razorpay_order_id)

        if (paymentDetails.status !== "captured" || order.status !== "paid") {
            return res.status(400).json({ error: "Payment not completed" })
        }

        const plan = await SubscriptionPlan.findOne({ _id: planId, isActive: true })

        if (!plan || order.amount !== Math.round(plan.price * 100)) {
            return res.status(400).json({ error: "Invalid subscription plan or amount" })
        }

        const activeSubscription = await Subscription.findOne({
            customer: req.user._id,
            status: "active",
            endDate: { $gt: new Date() }
        })

        if (activeSubscription) {
            return res.status(400).json({ error: "You already have an active subscription" })
        }

        const paymentMethodMap = {
            upi: "UPI",
            card: "card",
            netbanking: "netbanking",
            wallet: "wallet"
        }

        const paymentMethod = paymentMethodMap[paymentDetails.method] || "card"

        const currentDate = new Date()
        const endDate = new Date(currentDate)

        if (plan.billingCycle === "monthly") endDate.setMonth(endDate.getMonth() + 1)
        else if (plan.billingCycle === "quarterly") endDate.setMonth(endDate.getMonth() + 3)
        else if (plan.billingCycle === "yearly") endDate.setFullYear(endDate.getFullYear() + 1)

        const payment = await Payment.create({
            customer: req.user._id,
            plan: plan._id,
            amount: plan.price,
            paymentMethod,
            transactionId: razorpay_payment_id,
            status: "success"
        })

        const subscription = await Subscription.create({
            customer: req.user._id,
            plan: plan._id,
            startDate: currentDate,
            endDate,
            autoRenew: false,
            status: "active",
            payment: payment._id
        })

        res.status(201).json({
            success: "Payment verified and subscription activated",
            subscriptionData: subscription,
            paymentData: payment
        })
    } catch (e) {
        console.error("Payment verification failed:", e)
        res.status(500).json({ error: "Failed to verify payment" })
    }
})

module.exports = SubscriptionRouter