const express = require('express');
const User = require('../models/User');
const TokenAuthMiddleware = require('../middleware/TokenAuthMiddleware');
const AdminUserRouter = express.Router();

AdminUserRouter.get('/all', TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied!" });
    }
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json({
            success: "Customers fetched successfully",
            customerData: users
        });
    } catch (e) {
        console.error("Server failed to fetch customers:", e);
        res.status(500).json({ error: "Server failed to fetch customers" });
    }
});

module.exports = AdminUserRouter