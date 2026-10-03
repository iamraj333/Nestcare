const express = require('express')
const jwt = require('jsonwebtoken');
const TokenAuthMiddleware = require('../middleware/TokenAuthMiddleware');
const Professional = require('../models/Professional');
const Booking = require('../models/Booking');
require('dotenv').config()

const AdminRouter = express.Router();

//access all verification pending professional
AdminRouter.get('/professional/verification/pending', TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.json({ error: "Access Denied" })
        }
        else {
            const verificationPendingProfessional = await Professional.find({ verificationStatus: 'pending' }).select("-password")
            res.status(200).json({ pendingProfessional: verificationPendingProfessional })
        }

    } catch (e) {
        console.error("Server failed to fetch data: ", e)
        res.status(500).json({ error: "Server failed to fetch data" })
    }
})

AdminRouter.get('/professional/available', TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.json({ error: "Access denied" })
        }
        else {
            const professional = await Professional.find({ verificationStatus: "approved", isActive: true, availabilityStatus: "available" }).select("-password")
            res.status(200).json({ AllActiveApprovedProfessional: professional })
        }
    }
    catch (e) {
        console.error("Server failed to fetch professional: ", e)
        return res.status(500).json({ error: "Server failed to fetch professional" })
    }
})


/*============================== PROFESSIONAL VERIFICATION ==================================================================*/

//approving professional
AdminRouter.patch("/professional/:id/verification/approve", TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.json({ error: "Access denied" })
        }
        else {
            const professional = await Professional.findOne({ _id: req.params.id });
            if (professional.verificationStatus === "approved") {
                return res.json({ warning: "Professional is already approved" })
            }

            //set approve
            professional.verificationStatus = "approved"
            professional.isActive = true
            await professional.save();

            res.status(200).json({
                success: "Professional approved successfully",
                professionalId: professional._id,
                verificationStatus: professional.verificationStatus
            })
        }
    }
    catch (e) {
        console.error("Server failed approve: ", e)
        res.status(500).json({ error: "Server failed to approve" })
    }
})


//reject professional
AdminRouter.patch("/professional/:id/verification/reject", TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.json({ error: "Access denied" })
        }
        else {
            const professional = await Professional.findOne({ _id: req.params.id });
            if (professional.verificationStatus === "rejected") {
                return res.json({ warning: "Professional is already rejected" })
            }

            //set approve
            professional.verificationStatus = "rejected"
            professional.isActive = false
            await professional.save();

            res.status(200).json({
                success: "Professional rejected successfully",
                professionalId: professional._id,
                verificationStatus: professional.verificationStatus
            })
        }
    }
    catch (e) {
        console.error("Server failed to rejected: ", e)
        return res.status(500).json({ error: "Server failed to reject" })
    }
})



/*============================== BOOKING VERIFICATION ==================================================================*/

AdminRouter.get('/bookings/proposed', TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.json({ error: "Access denied" })
        }
        else {
            const booking = await Booking.find({ status: 'proposed' }).populate("customer", "name email phone address").populate("subscriptionId").populate("service").sort({ createdAt: -1 });

            res.status(200).json({ ProposedBooking: booking })

        }
    }
    catch (e) {
        console.error("Server failed to fetch booking: ", e)
        return res.status(500).json({ error: "Server failed to fetch booking data" })
    }
})


AdminRouter.patch('/booking/professionalAssign/:id', TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { professionalInfo } = req.body;

        if (!professionalInfo) {
            return res.status(400).json({ error: "Professional is required to assign booking" });
        }

        const professional = await Professional.findOne({
            _id: professionalInfo
        });

        if (!professional) {
            return res.status(404).json({ error: "Professional not exists" });
        }

        if (professional.verificationStatus !== "approved" || !professional.isActive) {
            return res.status(400).json({ error: "Professional is not verified" });
        }

        if (professional.availabilityStatus !== "available") {
            return res.status(400).json({ error: "Professional not available" });
        }

        const booking = await Booking.findOne({
            _id: req.params.id,
            status: "proposed"
        });

        if (!booking) {
            return res.status(404).json({ error: "Booking is not found or not proposed" });
        }

        if (booking.professional) {
            return res.status(400).json({ error: "Booking is already assigned to professional" });
        }

        booking.professional = professional._id;
        booking.status = "assigned";

        await booking.save();

        res.status(200).json({
            success: "Professional assigned successfully",
            booking: {
                id: booking._id,
                professional: professional._id,
                status: booking.status
            }
        });
    } catch (e) {
        console.error("Server failed to assign booking to professional:", e);
        return res.status(500).json({ error: "Server failed to assign booking to professional" });
    }
});



module.exports = AdminRouter