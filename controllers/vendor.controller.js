const Vendor = require('../models/vendor.model');
const sendToken = require('../Utils/SendToken');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Helper function to upload images to Cloudinary
const uploadImage = async (file) => {
    const upload = await cloudinary.uploader.upload(file.path, { folder: "vendors" });
    return { url: upload.secure_url, public_id: upload.public_id };
};

// Create a new Vendor
exports.createVendor = async (req, res) => {
    try {
        const { name, email, category, address, password } = req.body;

        const images = {};

        // Handle image uploads
        if (req.files) {
            if (req.files.FSSAIImage) {
                images.FSSAIImage = await uploadImage(req.files.FSSAIImage[0]);
            }
            if (req.files.AdharImageFront) {
                images.AdharImageFront = await uploadImage(req.files.AdharImageFront[0]);
            }
            if (req.files.AdharImageBack) {
                images.AdharImageBack = await uploadImage(req.files.AdharImageBack[0]);
            }
            if (req.files.PanImage) {
                images.PanImage = await uploadImage(req.files.PanImage[0]);
            }
        }

        const newVendor = new Vendor({
            name,
            email,
            category,
            address,
            ...images,
            password
        });

        await newVendor.save();
        res.status(201).json(newVendor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Vendors
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a Vendor by ID
exports.getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });

        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Vendor
exports.updateVendor = async (req, res) => {
    try {
        const { name, email, category, address } = req.body;
        const vendor = await Vendor.findById(req.params.id);

        if (!vendor) return res.status(404).json({ error: "Vendor not found" });

        // Update images if provided
        const images = {};
        if (req.files) {
            if (req.files.FSSAIImage) {
                if (vendor.FSSAIImage?.public_id) {
                    await cloudinary.uploader.destroy(vendor.FSSAIImage.public_id);
                }
                images.FSSAIImage = await uploadImage(req.files.FSSAIImage[0]);
            }
            if (req.files.AdharImageFront) {
                if (vendor.AdharImageFront?.public_id) {
                    await cloudinary.uploader.destroy(vendor.AdharImageFront.public_id);
                }
                images.AdharImageFront = await uploadImage(req.files.AdharImageFront[0]);
            }
            if (req.files.AdharImageBack) {
                if (vendor.AdharImageBack?.public_id) {
                    await cloudinary.uploader.destroy(vendor.AdharImageBack.public_id);
                }
                images.AdharImageBack = await uploadImage(req.files.AdharImageBack[0]);
            }
            if (req.files.PanImage) {
                if (vendor.PanImage?.public_id) {
                    await cloudinary.uploader.destroy(vendor.PanImage.public_id);
                }
                images.PanImage = await uploadImage(req.files.PanImage[0]);
            }
        }

        Object.assign(vendor, { name, email, category, address, ...images });
        await vendor.save();

        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Vendor
exports.deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });

        // Delete images from Cloudinary
        if (vendor.FSSAIImage?.public_id) {
            await cloudinary.uploader.destroy(vendor.FSSAIImage.public_id);
        }
        if (vendor.AdharImageFront?.public_id) {
            await cloudinary.uploader.destroy(vendor.AdharImageFront.public_id);
        }
        if (vendor.AdharImageBack?.public_id) {
            await cloudinary.uploader.destroy(vendor.AdharImageBack.public_id);
        }
        if (vendor.PanImage?.public_id) {
            await cloudinary.uploader.destroy(vendor.PanImage.public_id);
        }

        await vendor.remove();
        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.loginVendor = async (req, res) => {
    try {
        console.log("i am hit")
        const { email, password } = req.body;
        // if (!email || !password) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Please enter both email and password",
        //         error: "Please enter both email and password"
        //     })
        // }
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
                error: "Invalid email or password"
            })
        }

        await sendToken(vendor,res,200)


    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}