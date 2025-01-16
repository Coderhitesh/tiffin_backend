const mongoose = require('mongoose')

const FoodListingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: [
        {
            url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            }
        }
    ],
    tag: {
        type: String,
        required: true
    },
    HotelVendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
    },
    rating: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model('FoodListing', FoodListingSchema);