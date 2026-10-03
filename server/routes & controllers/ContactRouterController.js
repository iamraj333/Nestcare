const express = require("express");
const Contact = require("../models/Contact");
const TokenAuthMiddleware = require("../middleware/TokenAuthMiddleware");

const ContactRouter = express.Router();

ContactRouter.post("/create", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({
            success: "Your message has been sent successfully",
            contact
        });
    } catch (e) {
        console.error("Failed to create contact:", e);
        res.status(500).json({ error: "Server failed to send message" });
    }
});

//get all contact
ContactRouter.get("/all", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: "Contacts fetched successfully",
            contacts
        });
    } catch (e) {
        console.error("Failed to fetch contacts:", e);
        res.status(500).json({ error: "Server failed to fetch contacts" });
    }
});

//Admin Status updation
ContactRouter.patch("/status/:id", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const { status } = req.body;

        if (!["new", "read"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        contact.status = status;
        await contact.save();

        res.status(200).json({
            success: "Contact status updated successfully",
            contact
        });
    } catch (e) {
        console.error("Failed to update contact status:", e);
        res.status(500).json({ error: "Server failed to update contact status" });
    }
});

module.exports = ContactRouter;