const express = require('express');
const TokenAuthMiddleware = require('../middleware/TokenAuthMiddleware');
const Professional = require('../models/Professional');
const AdminProfessionalRouter = express.Router()

AdminProfessionalRouter.get('/all', TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied!" });
    }
    try {
        const professionals = await Professional.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: "Professionals fetched successfully",
            professionalData: professionals
        });
    } catch (e) {
        console.error("Server failed to fetch professionals:", e);
        res.status(500).json({ error: "Server failed to fetch professionals" });
    }
});

module.exports = AdminProfessionalRouter