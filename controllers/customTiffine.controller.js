const TiffinPlan = require('../models/customTiffine.model');

// Create a new Tiffin Plan
exports.createTiffinPlan = async (req, res) => {
    try {
        const { duration, meals, preferences } = req.body;

        // Validate meals structure
        if (!meals || !meals.breakfast || !meals.lunch || !meals.dinner) {
            return res.status(400).json({ error: "All meals (breakfast, lunch, dinner) are required." });
        }

        const newTiffinPlan = new TiffinPlan({
            duration,
            meals,
            preferences,
        });

        await newTiffinPlan.save();
        res.status(201).json(newTiffinPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Tiffin Plans
exports.getAllTiffinPlans = async (req, res) => {
    try {
        const tiffinPlans = await TiffinPlan.find();
        res.status(200).json(tiffinPlans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single Tiffin Plan by ID
exports.getTiffinPlanById = async (req, res) => {
    try {
        const tiffinPlan = await TiffinPlan.findById(req.params.id);
        if (!tiffinPlan) {
            return res.status(404).json({ error: "Tiffin Plan not found." });
        }

        res.status(200).json(tiffinPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Tiffin Plan
exports.updateTiffinPlan = async (req, res) => {
    try {
        const { duration, meals, preferences } = req.body;
        const tiffinPlan = await TiffinPlan.findById(req.params.id);

        if (!tiffinPlan) {
            return res.status(404).json({ error: "Tiffin Plan not found." });
        }

        if (meals) {
            if (meals.breakfast) tiffinPlan.meals.breakfast = meals.breakfast;
            if (meals.lunch) tiffinPlan.meals.lunch = meals.lunch;
            if (meals.dinner) tiffinPlan.meals.dinner = meals.dinner;
        }

        if (duration) tiffinPlan.duration = duration;
        if (preferences) tiffinPlan.preferences = preferences;

        await tiffinPlan.save();
        res.status(200).json(tiffinPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Tiffin Plan
exports.deleteTiffinPlan = async (req, res) => {
    try {
        const tiffinPlan = await TiffinPlan.findById(req.params.id);
        if (!tiffinPlan) {
            return res.status(404).json({ error: "Tiffin Plan not found." });
        }

        await tiffinPlan.remove();
        res.status(200).json({ message: "Tiffin Plan deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
