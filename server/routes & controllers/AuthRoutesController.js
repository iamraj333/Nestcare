const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const AuthRouter = express.Router()
const User = require('../models/User')
const Professional = require('../models/Professional')
const TokenAuthMiddleware = require('../middleware/TokenAuthMiddleware')

AuthRouter.post('/login', async (req, res) => {
    try {
        const token = req.cookies.auth_token;
        if (token) {
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const currentUser = await User.findOne({ email: decodeToken.email }).select("-password")
            res.json({ warning: "You're already logged in", currentUser: currentUser })
        } else {
            const { role, email, password, isRemember } = req.body;
            if (!email || !password || !role) {
                return res.status(400).json({ error: "All field is required" })
            }

            let checkAccount;
            let token;

            if (role === "customer") {
                checkAccount = await User.findOne({ email: email.toLowerCase() })
                if (!checkAccount) {
                    return res.status(400).json({ error: "Invalid credentials" })
                }
                const checkPassword = await bcrypt.compare(password, checkAccount.password)
                if (!checkPassword || !checkAccount) {
                    return res.status(400).json({ error: "Invalid credentials" })
                }

                token = jwt.sign({ role: "customer", email: email, phone: checkAccount.phone }, process.env.JWT_SECRET_KEY, { expiresIn: isRemember ? "7d" : "1d" })

            }
            else if (role === "professional") {
                checkAccount = await Professional.findOne({ email: email.toLowerCase() })
                if (!checkAccount) {
                    return res.status(400).json({ error: "Invalid credentials" })
                }
                const checkPassword = await bcrypt.compare(password, checkAccount.password)
                if (!checkPassword || !checkAccount) {
                    return res.status(400).json({ error: "Invalid credentials" })
                }

                token = jwt.sign({ role: "professional", email: email, phone: checkAccount.phone }, process.env.JWT_SECRET_KEY, {expiresIn: isRemember ? "7d" : "1d" })
            }
            else if (role === "admin") {
                if (password !== process.env.ADMIN_PASSWORD || email !== process.env.ADMIN_EMAIL) {
                    return res.status(400).json({ error: "Invalid credentials" })
                }

                token = jwt.sign({ role: "admin", email: email }, process.env.JWT_SECRET_KEY, { expiresIn: isRemember ? "7d" : "1d" })
            }

            res.cookie('auth_token', token, {
                httpOnly: true,
                sameSite: process.env.SERVER_FOR === "production" ? "none" : "lax",
                secure: process.env.SERVER_FOR === "production",
                maxAge: isRemember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
            })

            res.status(200).json({
                success: "Login successful",
                role: role
            })

        }
    }
    catch (e) {
        console.error("Failed Login Server: ", e)
        return res.json({ error: "Login server failed" })
    }

})

AuthRouter.get('/me', TokenAuthMiddleware, async (req, res) => {
    try {
        res.status(200).json({
            role: req.role,
            user: req.user
        })

    }
    catch (e) {
        console.error("Failed to User server: ", e)
        return res.status(500).json({ error: "Failed to user server" })
    }
})

AuthRouter.post('/logout', (req, res) => {
    try {
        res.clearCookie("auth_token", {
            httpOnly: true,
            secure: process.env.SERVER_FOR === "production",
            sameSite: "lax"
        });

        return res.status(200).json({
            success: "User logout successfully"
        });
    }
    catch (e) {
        console.error("Logout Error:", e);
        return res.status(500).json({
            error: "Logout failed"
        });
    }
})

module.exports = AuthRouter