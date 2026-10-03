const express = require('express');
const TokenAuthMiddleware = require('../middleware/TokenAuthMiddleware');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');

const SubscriptionPlanRouter = express.Router();

SubscriptionPlanRouter.post('/create', TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied" })
    }
    try {
        const { name, description, billingCycle, price, benefits, isActive } = req.body

        if (!name || !description || !billingCycle || price == undefined || !benefits) {
            return res.status(400).json({ error: "All field is required" })
        }

        const isPlanAlreadyExists = await SubscriptionPlan.findOne({ name: name.trim() })
        if (isPlanAlreadyExists) {
            return res.status(400).json({ error: "Plan already created" })
        }

        const createPlan = await SubscriptionPlan.create({ name: name, description: description, billingCycle: billingCycle, price: price, benefits: benefits, isActive: isActive ?? true })
        res.status(201).json({
            success: "Plan created successfully",
            plan: createPlan
        })

    } catch (e) {
        console.error("Failed in Creating plan server: ", e)
        res.status(500).json({ error: "Failed in Creating plan server" })
    }

})

//Get All plans
SubscriptionPlanRouter.get('/all', async (req, res) => {
    try {
        const allPlans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
        res.status(201).json({ SubscriptionPlan: allPlans })
    }
    catch (e) {
        console.error("Failed to fetch plans: ", e)
        res.status(500).json({ error: "Server failed to fetch plans" })
    }
})


// GET ALL PLANS
SubscriptionPlanRouter.get('/admin/all', TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const allPlans = await SubscriptionPlan.find().sort({ price: 1 });

        res.status(200).json({
            SubscriptionPlan: allPlans
        });
    } catch (e) {
        console.error("Failed to fetch admin plans:", e);
        res.status(500).json({
            error: "Server failed to fetch plans"
        });
    }
});



SubscriptionPlanRouter.get('/:id', async (req, res) => {
    try {
        const subscriptionPlan = await SubscriptionPlan.findOne({ _id: req.params.id, isActive: true })
        res.status(200).json({ subscriptionPlan: subscriptionPlan })
    }
    catch (e) {
        console.error("Failed to fetch subscription plan: ", e)
        return res.status(500).json({ error: "Failed to fetch subscription plan" })
    }
})


/*=================== SUBSCRIPTION PLANS ACTIVATE/DECATIVATE ============================================== */
SubscriptionPlanRouter.patch('/admin/:id/status', TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                error: "isActive must be true or false"
            });
        }

        const plan = await SubscriptionPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                error: "Subscription plan not found"
            });
        }

        plan.isActive = isActive;
        await plan.save();

        res.status(200).json({
            success: `Plan ${isActive ? "activated" : "deactivated"} successfully`,
            plan
        });
    } catch (e) {
        console.error("Failed to update plan status:", e);
        res.status(500).json({
            error: "Server failed to update plan status"
        });
    }
});



module.exports = SubscriptionPlanRouter