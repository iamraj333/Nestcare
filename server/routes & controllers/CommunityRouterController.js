const express = require("express");
const Community = require("../models/Community");
const TokenAuthMiddleware = require("../middleware/TokenAuthMiddleware");

const CommunityRouter = express.Router();

CommunityRouter.post("/subscribe", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({
                error: "Email is required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                error: "Please enter a valid email"
            });
        }

        const existingSubscriber = await Community.findOne({
            email: normalizedEmail
        });

        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                return res.status(400).json({
                    error: "You're already subscribed"
                });
            }

            existingSubscriber.isActive = true;
            existingSubscriber.subscribedAt = new Date();
            await existingSubscriber.save();

            return res.status(200).json({
                success: "Welcome back to the NestCare community!"
            });
        }

        await Community.create({
            email: normalizedEmail
        });

        res.status(201).json({
            success: "Thanks for joining the NestCare community!"
        });
    } catch (e) {
        console.error("Failed to subscribe community email:", e);

        if (e.code === 11000) {
            return res.status(400).json({
                error: "This email is already subscribed"
            });
        }

        res.status(500).json({
            error: "Server failed to subscribe email"
        });
    }
});

CommunityRouter.get("/all", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({
            error: "Access denied"
        });
    }

    try {
        const communityData = await Community.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: "Community data fetched successfully",
            communityData
        });
    } catch (e) {
        console.error("Failed to fetch community data:", e);

        res.status(500).json({
            error: "Server failed to fetch community data"
        });
    }
});

module.exports = CommunityRouter;