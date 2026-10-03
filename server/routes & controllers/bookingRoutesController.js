const express = require('express')
const TokenAuthMiddleware = require('../middleware/TokenAuthMiddleware')
const Service = require('../models/Service')
const Subscription = require('../models/Subscription')
const Booking = require('../models/Booking')
const Professional = require('../models/Professional')
const BookingRouter = express.Router()

BookingRouter.post("/create", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "customer") {
        return res.status(403).json({ error: "Access denied!" });
    }

    try {
        const { serviceId, scheduledDate, timeSlot, address, notes } = req.body;

        if (!serviceId || !scheduledDate || !timeSlot || !address) {
            return res.status(400).json({
                error: "All required fields are required"
            });
        }

        const service = await Service.findOne({
            _id: serviceId,
            isActive: true
        });

        if (!service) {
            return res.status(404).json({
                error: "Service not found"
            });
        }

        const subscription = await Subscription.findOne({
            customer: req.user._id,
            status: "active"
        }).populate("plan");

        if (!subscription) {
            return res.status(400).json({
                error: "Active subscription is required to book a service"
            });
        }

        if (new Date(subscription.endDate) < new Date()) {
            subscription.status = "expired";
            await subscription.save();

            return res.status(400).json({
                error: "Your subscription has expired. Please purchase a new subscription."
            });
        }

        //also check whether the service is included in your subscription benefit or not
        if (!subscription.plan) {
            return res.status(400).json({
                error: "Subscription plan not found"
            });
        }
        
        const subscriptionBenefits = subscription.plan.benefits;
        const isServiceIncludedInSubscription = subscriptionBenefits.some((benefit) => {
            return benefit.service.trim().toLowerCase() === service.category.trim().toLowerCase()
        })

        if (!isServiceIncludedInSubscription) {
            return res.status(400).json({
                error: "This service is not included in your subscription plan"
            });
        }

        const booking = await Booking.create({
            customer: req.user._id,
            subscriptionId: subscription._id,
            service: service._id,
            address: address,
            scheduleDate: scheduledDate,
            timeSlot: timeSlot,
            notes: notes || "",
            status: "proposed",
            paymentStatus: "not-required"
        });

        res.status(201).json({
            success: "Service booking created successfully",
            bookingData: booking
        });
    } catch (e) {
        console.error("Server failed to create booking:", e);

        res.status(500).json({
            error: "Server failed to create booking"
        });
    }
});


BookingRouter.get("/my", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "customer") {
        return res.status(403).json({ error: "Access denied!" });
    }

    try {
        const bookings = await Booking.find({
            customer: req.user._id
        })
            .populate("service", "name category image duration")
            .populate("professional", "name phone serviceCategory")
            .populate("subscriptionId", "startDate endDate status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: "Bookings fetched successfully",
            bookingData: bookings
        });
    } catch (e) {
        console.error("Server failed to fetch customer bookings:", e);
        res.status(500).json({
            error: "Server failed to fetch bookings"
        });
    }
});


BookingRouter.patch("/cancel/:id", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "customer") {
        return res.status(403).json({ error: "Access denied!" });
    }

    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            customer: req.user._id
        });

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        if (!["proposed", "confirmed", "assigned", "accepted"].includes(booking.status)) {
            return res.status(400).json({
                error: "This booking cannot be cancelled"
            });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            success: "Booking cancelled successfully",
            bookingData: booking
        });
    } catch (e) {
        console.error("Server failed to cancel booking:", e);
        res.status(500).json({
            error: "Server failed to cancel booking"
        });
    }
});



BookingRouter.get("/all", TokenAuthMiddleware, async (req, res) => {
    if (req.role != "admin") {
        return res.status(403).json({ error: "Access denied!" })
    }
    try {
        //fetch all booking data and sort using sort() function and newest to olest using {createdAt:-1}
        const AllBookingData = await Booking.find().populate('customer', "-password").populate("subscriptionId").populate('service').populate('professional', "-password")

        res.status(201).json({ BookingData: AllBookingData })
    } catch (e) {
        console.error("Server failed to fetch booking: ", e)
        res.status(500).json({ error: "Server failed to fetch booking" })
    }
})


/*======================== BOOKING RATING AND REVIEWS ========================================= */
BookingRouter.patch("/review/:id", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "customer") {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const { rating, review } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5" });
        }

        const booking = await Booking.findOne({
            _id: req.params.id,
            customer: req.user._id,
            status: "completed"
        });

        if (!booking) {
            return res.status(404).json({ error: "Completed booking not found" });
        }

        if (booking.rating) {
            return res.status(400).json({ error: "You have already reviewed this booking" });
        }

        booking.rating = rating;
        booking.review = review || "";
        await booking.save();

        if (booking.professional) {
            const professional = await Professional.findById(booking.professional);

            if (professional) {
                const reviewedBookings = await Booking.find({
                    professional: professional._id,
                    status: "completed",
                    rating: { $exists: true, $ne: null }
                });

                const totalRating = reviewedBookings.reduce(
                    (sum, item) => sum + item.rating,
                    0
                );

                professional.rating = reviewedBookings.length
                    ? Number((totalRating / reviewedBookings.length).toFixed(1))
                    : 0;

                await professional.save();
            }
        }

        res.status(200).json({
            success: "Review submitted successfully",
            bookingData: booking
        });
    } catch (e) {
        console.error("Failed to submit review:", e);
        res.status(500).json({ error: "Failed to submit review" });
    }
});
module.exports = BookingRouter