const express = require("express")
const DisputeRouter = express.Router()

const Dispute = require("../models/Dispute")
const Booking = require("../models/Booking")
const TokenAuthMiddleware = require("../middleware/TokenAuthMiddleware")


//CREATNG dispute
DisputeRouter.post("/create", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "customer") {
        return res.status(403).json({ error: "Access denied" })
    }

    try {
        const { bookingId, subject, description } = req.body

        if (!bookingId || !subject || !description) {
            return res.status(400).json({
                error: "Booking, subject and description are required"
            })
        }

        const booking = await Booking.findOne({
            _id: bookingId,
            customer: req.user._id
        }).populate("professional")

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found"
            })
        }

        if (booking.status !== "completed") {
            return res.status(400).json({
                error: "You can raise a dispute only for completed bookings"
            })
        }

        if (!booking.professional) {
            return res.status(400).json({
                error: "Professional not found for this booking"
            })
        }

        const existingDispute = await Dispute.findOne({
            booking: booking._id,
            customer: req.user._id,
            status: { $in: ["open", "under-review"] }
        })

        if (existingDispute) {
            return res.status(400).json({
                error: "An active dispute already exists for this booking"
            })
        }

        const dispute = await Dispute.create({
            customer: req.user._id,
            booking: booking._id,
            professional: booking.professional._id,
            subject,
            description
        })

        res.status(201).json({
            success: "Dispute created successfully",
            disputeData: dispute
        })
    } catch (e) {
        console.error("Failed to create dispute:", e)
        res.status(500).json({
            error: "Server failed to create dispute"
        })
    }
})


//Find current customer booking
DisputeRouter.get("/my", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "customer") {
        return res.status(403).json({ error: "Access denied" })
    }

    try {
        const disputes = await Dispute.find({
            customer: req.user._id
        })
            .populate("booking")
            .populate("professional", "name serviceCategory")
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: "Disputes fetched successfully",
            disputeData: disputes
        })
    } catch (e) {
        console.error("Failed to fetch disputes:", e)
        res.status(500).json({
            error: "Server failed to fetch disputes"
        })
    }
})


//All dispute fetch for admin
DisputeRouter.get("/all", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied" })
    }

    try {
        const disputes = await Dispute.find()
            .populate("customer", "name email phone")
            .populate("booking", "scheduleDate timeSlot status")
            .populate("professional", "name email serviceCategory")
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: "Disputes fetched successfully",
            disputeData: disputes
        })
    } catch (e) {
        console.error("Failed to fetch disputes:", e)
        res.status(500).json({
            error: "Server failed to fetch disputes"
        })
    }
})

//Update dispute status
DisputeRouter.patch("/status/:id", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied" })
    }

    try {
        const { status, resolution } = req.body

        if (!["under-review", "resolved", "rejected"].includes(status)) {
            return res.status(400).json({
                error: "Invalid dispute status"
            })
        }

        if ((status === "resolved" || status === "rejected") && !resolution) {
            return res.status(400).json({
                error: "Resolution is required"
            })
        }

        const dispute = await Dispute.findById(req.params.id)

        if (!dispute) {
            return res.status(404).json({
                error: "Dispute not found"
            })
        }

        dispute.status = status

        if (resolution) {
            dispute.resolution = resolution
        }

        if (status === "resolved" || status === "rejected") {
            dispute.resolvedBy = "admin"
            dispute.resolvedAt = new Date()
        }

        await dispute.save()

        res.status(200).json({
            success: "Dispute status updated successfully",
            disputeData: dispute
        })
    } catch (e) {
        console.error("Failed to update dispute:", e)
        res.status(500).json({
            error: "Server failed to update dispute"
        })
    }
})




module.exports = DisputeRouter