const express = require('express');
const { createUser } = require('../controllers/user.controller');
const { createCategory, getAllCategories } = require('../controllers/category.controller');
const Router = express.Router();
const multer = require('multer');
const { createFoodListing,
    getAllFoodListings,
    getFoodListingById,
    updateFoodListing,
    deleteFoodListing } = require('../controllers/foodListing.controller');
const {  createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
    loginVendor,
    getMyDetails, } = require('../controllers/vendor.controller');
const { createTiffinPlan,
    getAllTiffinPlans,
    getTiffinPlanById,
    updateTiffinPlan,
    deleteTiffinPlan, } = require('../controllers/customTiffine.controller');
const  protect  = require('../Middleware/Protect');
const upload = multer({ dest: 'uploads/' });

Router.post('/create_user', createUser)

Router.post('/category', createCategory)
Router.get('/all_category', getAllCategories)

// food listing here 
Router.post('/food_listing', upload.array('image', 5), createFoodListing);
Router.get('/food_listing', getAllFoodListings);
Router.get('/food_listing/:id', getFoodListingById);
Router.put('/food_listing/:id', upload.array('image', 5), updateFoodListing);
Router.delete('/food_listing/:id', deleteFoodListing);


// vendor route here 

Router.post('/vendor', upload.fields([
    { name: 'FSSAIImage', maxCount: 1 },
    { name: 'AdharImageFront', maxCount: 1 },
    { name: 'AdharImageBack', maxCount: 1 },
    { name: 'PanImage', maxCount: 1 },
]), createVendor);
Router.get('/vendor', getAllVendors);
Router.get('/vendor/:id', getVendorById);
Router.put('/vendor/:id', upload.fields([
    { name: 'FSSAIImage', maxCount: 1 },
    { name: 'AdharImageFront', maxCount: 1 },
    { name: 'AdharImageBack', maxCount: 1 },
    { name: 'PanImage', maxCount: 1 },
]), updateVendor);
Router.delete('/vendor/:id', deleteVendor);
Router.post('/login',loginVendor)
Router.get('/find_vendor',protect,getMyDetails)

// custom tiffin rote here 

Router.post('/custom_tiffin', createTiffinPlan); // Create a new Tiffin Plan
Router.get('/custom_tiffin', getAllTiffinPlans); // Get all Tiffin Plans
Router.get('/custom_tiffin/:id', getTiffinPlanById); // Get a Tiffin Plan by ID
Router.put('/custom_tiffin/:id', updateTiffinPlan); // Update a Tiffin Plan
Router.delete('/custom_tiffin/:id', deleteTiffinPlan); // Delete a Tiffin Plan

module.exports = Router;
