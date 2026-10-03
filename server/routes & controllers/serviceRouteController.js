const express = require('express')
const TokenAuthMiddleware = require('../middleware/TokenAuthMiddleware')
const Service = require('../models/Service')
const upload = require('../middleware/MulterUpload')
const cloudinary = require('../config/Cloudinary')
const ServiceRouter = express.Router()

//create service
ServiceRouter.post('/create', TokenAuthMiddleware, upload.single('image'), async (req, res) => {
    if (req.role != "admin") {
        return res.status(403).json({ error: "Access denied!" })
    }
    try {
        const { name, category, description, features, basePrice, duration } = req.body

        if (!name || !category || !description || basePrice == undefined || !duration || !req.file) {
            return res.status(400).json({ error: "All field is required" })
        }

        const isServiceAlreadyExists = await Service.findOne({ name: name.trim() })
        if (isServiceAlreadyExists) {
            return res.status(400).json({ error: "Service already exists" })
        }

        const sendImagetoCloudinary = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "nestcare/services", resource_type: 'image' }, (
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary Error: ", error)
                            reject(error)
                        }
                        else { resolve(result) }
                    })
                )

                stream.end(req.file.buffer)
            })
        }

        const getCloudinaryResult = await sendImagetoCloudinary();

        const ServiceCreate = await Service.create({ name: name.trim(), category: category, description: description.trim(), image: getCloudinaryResult.secure_url, features: features ? JSON.parse(features) : [], basePrice: Number(basePrice), duration: Number(duration) })
        res.status(201).json({ success: "Service created successfully", serviceData: ServiceCreate })
    }
    catch (e) {
        console.error("Server failed in service creation: ", e)
        res.status(500).json({ error: "Server failed to create service" })
    }
})


//Get all Active Servie
ServiceRouter.get("/all", async (req, res) => {
    try {
        const fetchAllService = await Service.find({ isActive: true }).sort({ createdAt: -1 })
        res.status(201).json({ allServices: fetchAllService })
    }
    catch (e) {
        console.error("Server failed to fetch active service: ", e)
        res.status(500).json({ error: "Server failed to fetch active service" })
    }
})

//Get All service
ServiceRouter.get("/admin/all", TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied" })
    }
    try {
        const fetchAllService = await Service.find().sort({ createdAt: -1 })
        res.status(201).json({ serviceData: fetchAllService })
    }
    catch (e) {
        console.error("Server failed to fetch service: ", e)
        res.status(500).json({ error: "Server failed to fetch service" })
    }
})


//Get Specific Service
ServiceRouter.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)

        if (!service) {
            return res.status(404).json({ error: "Service not found" })
        }

        res.status(200).json({
            success: "Service fetched successfully",
            serviceData: service
        })
    }
    catch (e) {
        console.error("Server failed to fetch service:", e)
        res.status(500).json({
            error: "Server failed to fetch service"
        })
    }
})



/* ==================== UPDATING SERVICE INFO =================================================*/
ServiceRouter.put('/update/:id', TokenAuthMiddleware, upload.single('image'), async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied!" })
    }

    try {
        const { name, category, description, features, basePrice, duration } = req.body

        if (!name || !category || !description || basePrice == undefined || !duration) {
            return res.status(400).json({ error: "All field is required" })
        }

        const service = await Service.findById(req.params.id)

        if (!service) {
            return res.status(404).json({ error: "Service not found" })
        }

        let image = service.image

        if (req.file) {
            const uploadImage = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "nestcare/services",
                            resource_type: "image"
                        },
                        (error, result) => {
                            if (error) {
                                console.error("Cloudinary Error:", error)
                                reject(error)
                            } else {
                                resolve(result)
                            }
                        }
                    )

                    stream.end(req.file.buffer)
                })
            }

            const cloudinaryResult = await uploadImage()
            image = cloudinaryResult.secure_url
        }

        service.name = name.trim()
        service.category = category
        service.description = description.trim()
        service.features = features ? JSON.parse(features) : []
        service.basePrice = Number(basePrice)
        service.duration = Number(duration)
        service.image = image

        await service.save()

        res.status(200).json({
            success: "Service updated successfully",
            serviceData: service
        })
    }
    catch (e) {
        console.error("Server failed to update service:", e)
        res.status(500).json({
            error: "Server failed to update service"
        })
    }
})

//update status
ServiceRouter.patch('/status/:id', TokenAuthMiddleware, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({ error: "Access denied!" })
    }

    try {
        const service = await Service.findById(req.params.id)
        if (!service) {
            return res.status(404).json({ error: "Service not found" })
        }

        //if true then false, and if false then true
        service.isActive = !service.isActive
        await service.save()
        res.status(200).json({
            success: `Service ${service.isActive ? "activated" : "deactivated"} successfully`,
            serviceData: service
        })
    }
    catch (e) {
        console.error("Server failed to update service status:", e)
        res.status(500).json({
            error: "Server failed to update service status"
        })
    }
})


module.exports = ServiceRouter