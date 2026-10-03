const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const TokenAuthMiddleware = require('../middleware/TokenAuthMiddleware')
const Professional = require('../models/Professional')

const UserRouter = express.Router()

UserRouter.post("/register", async (req, res) => {
    try {
        const token = req.cookies.auth_token;
        if (token) {
            return res.json({ warning: "You're already logged In" })
        } else {
            const { name, email, phone, password, address } = req.body

            if (!name || !email || !phone || !password || !address) {
                return res.status(400).json({
                    error: "All required fields are required"
                })
            }

            //checking existing user
            const isUserAlreadyExists = await User.findOne({ email: email })
            if (isUserAlreadyExists) {
                return res.status(400).json({
                    error: "You're already registered"
                })
            }

            //Hashing password
            const hashPassword = await bcrypt.hash(password, 10)
            const user = await User.create({ name: name, email: email, phone: phone, password: hashPassword, address: address });
            //Creating token
            const token = jwt.sign({ role: "customer", email: email, phone: phone }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

            // Storing token in cookie
            res.cookie("auth_token", token, {
                httpOnly: true,
                sameSite: process.env.SERVER_FOR === "production" ? "none" : "lax",
                secure: process.env.SERVER_FOR === "production",
                path: "/",
                maxAge: 1 * 24 * 60 * 60 * 1000 //1day
            })

            res.status(201).json({
                success: "User registered successfully",
                user: {
                    user: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    isActive: user.isActive
                }
            })
        }

    }
    catch (error) {
        console.error("Failed in registration server: ", error)
        return res.status(500).json({
            error: "Failed in registration server"
        });
    }

})


//CHANGE PASSWORD
UserRouter.patch("/changePassword", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "customer" && req.role !== "professional") {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: "Current and new password are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                error: "New password must be at least 8 characters"
            });
        }

        const Model = req.role === "customer" ? User : Professional;

        const user = await Model.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                error: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            success: "Password changed successfully"
        });
    } catch (e) {
        console.error("Failed to change password:", e);
        res.status(500).json({
            error: "Server failed to change password"
        });
    }
});


module.exports = UserRouter