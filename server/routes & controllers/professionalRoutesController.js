const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require('bcryptjs');
const Professional = require('../models/Professional');
const TokenAuthMiddleware = require('../middleware/TokenAuthMiddleware');
const Booking = require('../models/Booking');
require('dotenv').config()

const ProfessionalRouter = express.Router();


ProfessionalRouter.post('/register', async (req, res) => {
    try {
        const token = req.cookies.auth_token;
        if (token) {
            return res.json({ warning: "You're already logged In" })
        } else {
            const { name, email, phone, password, address, serviceCategory, experience, document } = req.body;

            if (!name || !email || !phone || !password || !address || serviceCategory.length == 0 || !experience || !document) {
                return res.status(400).json({ error: "All field is required" })
            }

            const isEmailExists = await Professional.findOne({ email: email.toLowerCase() })
            if (isEmailExists) {
                return res.status(400).json({ error: "You're already registered" })
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const professional = await Professional.create({ name: name, email: email, phone: phone, password: hashPassword, address: address, serviceCategory: serviceCategory, experience: experience, document: document })
            const token = jwt.sign({ role: "professional", email: email.toLowerCase(), phone: phone }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
            res.cookie('auth_token', token, {
                httpOnly: true,
                sameSite: process.env.SERVER_FOR === "production" ? "none" : "lax",
                secure: process.env.SERVER_FOR === "production",
                maxAge: 1 * 24 * 60 * 60 * 1000 //1day
            })

            res.status(201).json({
                success: "Professional registered successfully",
                professional: {
                    id: professional._id,
                    name: professional.name,
                    email: professional.email,
                    phone: professional.phone,
                    address: professional.address,
                    serviceCategory: professional.serviceCategory,
                    experience: professional.experience,
                    verificationStatus: professional.verificationStatus,
                    availabilityStatus: professional.availabilityStatus,
                }
            })
        }
    }
    catch (error) {
        console.error("Failed in registration server: ", error)
        return res.status(500).json({ error: "Failed in registration server" });
    }
})

//Update Availability status
ProfessionalRouter.patch('/availability/update', TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "professional") {
            return res.json({ error: "Access denied" })
        }
        else {
            const { availabilityCheck } = req.body;
            if (!availabilityCheck) {
                return res.json({ error: "Availability status is required" })
            }
            const professional = await Professional.findOne({ _id: req.user._id })
            if (!professional) {
                return res.json({ error: "Professional not found" })
            }
            professional.availabilityStatus = availabilityCheck.toLowerCase()
            await professional.save();
            res.json({ success: `You're ${availabilityCheck.toLowerCase()}` })
        }
    }
    catch (e) {
        console.error("Server failed to update availability status: ", e)
        return res.status(500).json({ error: "Server failed to update availability status" })

    }
})

//Fetch all assigned service to me
ProfessionalRouter.get('/booking/assigned/me', TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "professional") {
            return res.status(403).json({ error: "Access denied" });
        }

        const AssignedBooking = await Booking.find({
            professional: req.user._id,
            status: { $in: ["assigned", "accepted", "in-progress"] }
        })
            .populate("customer", "name email phone address")
            .populate("service")
            .populate("subscriptionId")
            .sort({ scheduleDate: 1 });

        res.status(200).json({ AssignedBooking });
    } catch (e) {
        console.error("Failed to fetch assignment:", e);
        return res.status(500).json({ error: "Failed to fetch assignment" });
    }
});


/*======================== BOOKINGS STATUS UPDATION======================================================================*/
ProfessionalRouter.patch("/assigned/booking/accept/:id", TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "professional") {
            return res.status(403).json({ error: "Access denied" });
        }

        const booking = await Booking.findOne({
            _id: req.params.id,
            professional: req.user._id
        });

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found or this booking is not assigned to you"
            });
        }

        if (booking.status !== "assigned") {
            return res.status(400).json({
                error: "Only assigned booking can be accepted"
            });
        }

        booking.status = "accepted";
        await booking.save();

        res.status(200).json({
            success: "Assigned booking is accepted successfully"
        });
    } catch (e) {
        console.error("Failed to accept booking:", e);
        return res.status(500).json({
            error: "Failed to accept booking"
        });
    }
});

ProfessionalRouter.patch("/assigned/booking/reject/:id", TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "professional") {
            return res.json({ error: "Acccess denied" })
        }
        else {
            const booking = await Booking.findOne({ _id: req.params.id, professional: req.user._id })
            if (!booking) {
                return res.json({ error: "Booking is not found" })
            }
            if (booking.status !== "assigned") {
                return res.json({ error: "Booking cannot be cancelled" })
            }

            booking.status = "proposed"
            booking.professional = null
            await booking.save()

            res.status(200).json({ success: "Assigned booking is rejected successfully" })
        }
    }
    catch (e) {
        console.error("Failed to accept booking: ", e)
        return res.status(500).json({ error: "Failed to accept booking" })
    }
})

ProfessionalRouter.patch("/assigned/booking/start/:id", TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "professional") {
            return res.status(403).json({ error: "Access denied" });
        }
        const booking = await Booking.findOne({
            _id: req.params.id,
            professional: req.user._id
        });
        if (!booking) {
            return res.status(404).json({ error: "Booking not found or this booking is not assigned to you" });
        }
        if (booking.status !== "accepted") {
            return res.status(400).json({ error: "Only accepted booking can be started" });
        }
        booking.status = "in-progress";
        await booking.save();
        res.status(200).json({
            success: "Booking started successfully",
            booking: { id: booking._id, status: booking.status }
        });
    } catch (e) {
        console.error("Failed to start booking:", e);
        return res.status(500).json({ error: "Failed to start booking" });
    }
});

ProfessionalRouter.patch("/assigned/booking/complete/:id", TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "professional") {
            return res.status(403).json({ error: "Access denied" });
        }
        const booking = await Booking.findOne({
            _id: req.params.id,
            professional: req.user._id
        });
        if (!booking) {
            return res.status(404).json({ error: "Booking is not found or this booking is not assigned to you" });
        }
        if (booking.status !== "in-progress") {
            return res.status(400).json({ error: "Only in-progress booking can be completed" });
        }
        booking.status = "completed";
        await booking.save();
        res.status(200).json({
            success: "Booking assignment completed successfully",
            booking: { id: booking._id, status: booking.status }
        });
    } catch (e) {
        console.error("Failed to complete booking assignment:", e);
        return res.status(500).json({ error: "Failed to complete booking assignment" });
    }
});


// PROFESSIONAL SERVICE HISTORY
ProfessionalRouter.get("/booking/history", TokenAuthMiddleware, async (req, res) => {
    try {
        if (req.role !== "professional") {
            return res.status(403).json({ error: "Access denied" });
        }
        const bookings = await Booking.find({
            professional: req.user._id,
            status: "completed"
        })
            .populate("customer", "name phone")
            .populate("service", "name category")
            .populate("subscriptionId")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: "Booking history fetched successfully",
            bookingData: bookings
        });
    } catch (e) {
        console.error("Failed to fetch booking history:", e);
        return res.status(500).json({
            error: "Failed to fetch booking history"
        });
    }
});


module.exports = ProfessionalRouter