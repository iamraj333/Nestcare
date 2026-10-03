const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Professional = require('../models/Professional')
require('dotenv').config()

const TokenAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.auth_token

    if (!token) {
        return res.status(401).json({
            error: "Token is not found"
        })
    }
    else {
        try {
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = decodeToken

            if (decodeToken.role === "customer") {
                //find user
                const currentUser = await User.findOne({ email: decodeToken.email }).select("-password")
                if (!currentUser) {
                    return res.status(400).json({
                        error: "User not found"
                    })
                }
                if (!currentUser.isActive) {
                    return res.status(400).json({ error: "User is inactive" })
                }

                req.user = currentUser
                req.role = "customer"
                return next()
            }
            if (decodeToken.role === "professional") {
                //find user
                const currentProfessional = await Professional.findOne({ email: decodeToken.email }).select("-password")
                if (!currentProfessional) {
                    return res.status(400).json({
                        error: "Professional not found"
                    })
                }
                if (!currentProfessional.isActive) {
                    return res.status(400).json({ error: "Professional is inactive" })
                }

                req.user = currentProfessional
                req.role = "professional"
                return next()
            }
            if (decodeToken.role === "admin") {
                req.user = {name:"Admin", email: process.env.ADMIN_EMAIL }
                req.role = "admin"
                return next();
            }

            return res.status(403).json({
                error: "Invalid user role"
            })

        }
        catch (e) {
            console.error("Token Error: ", e)
            return res.json({ error: "Token is invalid or expired" })
        }
    }
}


module.exports = TokenAuthMiddleware