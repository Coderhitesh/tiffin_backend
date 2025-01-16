const Category = require('../models/category.model')

exports.createCategory =async(req,res)=>{
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Title and Icon are required' });
        }

        const category = await Category.create({ title });
        res.status(201).json({ success: true, message: 'Category created successfully', data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if(!categories){
            return res.status(400).json({
                success: false,
                message: 'No categories found',
                error: 'No categories found'
            })
        }
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
    }
};