const FoodListing = require('../models/foodListing.model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Helper to upload images
const uploadImages = async (files) => {
    const uploads = files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "food-listings" })
    );
    return Promise.all(uploads);
};

// Create a new food listing
exports.createFoodListing = async (req, res) => {
    try {
        const { name, description, price, tag, HotelVendor } = req.body;

        if (req.files.length > 5) {
            return res.status(400).json({ error: "You can only upload up to 5 images." });
        }

        const imageUploads = await uploadImages(req.files);
        const images = imageUploads.map((upload) => ({
            url: upload.secure_url,
            public_id: upload.public_id,
        }));

        const newFoodListing = new FoodListing({
            name,
            description,
            price,
            tag,
            HotelVendor,
            image: images, // Store all uploaded images
        });

        await newFoodListing.save();
        res.status(201).json(newFoodListing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all food listings
exports.getAllFoodListings = async (req, res) => {
    try {
        const listings = await FoodListing.find().populate('HotelVendor');
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single food listing by ID
exports.getFoodListingById = async (req, res) => {
    try {
        const listing = await FoodListing.findById(req.params.id).populate('HotelVendor');
        if (!listing) return res.status(404).json({ error: "Food listing not found" });

        res.status(200).json(listing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a food listing
exports.updateFoodListing = async (req, res) => {
    try {
        const { name, description, price, tag, HotelVendor } = req.body;
        const listing = await FoodListing.findById(req.params.id);

        if (!listing) return res.status(404).json({ error: "Food listing not found" });

        if (req.files && req.files.length > 0) {
            if (req.files.length > 5) {
                return res.status(400).json({ error: "You can only upload up to 5 images." });
            }

            // Remove old images
            for (const img of listing.image) {
                await cloudinary.uploader.destroy(img.public_id);
            }

            // Upload new images
            const imageUploads = await uploadImages(req.files);
            const images = imageUploads.map((upload) => ({
                url: upload.secure_url,
                public_id: upload.public_id,
            }));

            listing.image = images; // Replace with new images
        }

        listing.name = name || listing.name;
        listing.description = description || listing.description;
        listing.price = price || listing.price;
        listing.tag = tag || listing.tag;
        listing.HotelVendor = HotelVendor || listing.HotelVendor;

        await listing.save();
        res.status(200).json(listing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a food listing
exports.deleteFoodListing = async (req, res) => {
    try {
        const listing = await FoodListing.findById(req.params.id);
        if (!listing) return res.status(404).json({ error: "Food listing not found" });

        // Delete all images from Cloudinary
        for (const img of listing.image) {
            await cloudinary.uploader.destroy(img.public_id);
        }

        await listing.remove();
        res.status(200).json({ message: "Food listing deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
