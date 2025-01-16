const mongoose = require('mongoose')

const VendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    address: {
        area: {
            type: String,

        },
        street_address: {
            type: String,

        },
        landmark: {
            type: String,

        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        },
        pincode: {
            type: String,

        }
    },
    FSSAIImage: {
        url: {
            type: String
        },
        public_id: {
            type: String
        }
    },
    AdharImageFront: {
        url: {
            type: String,
            // required: true
        },
        public_id: {
            type: String,
            // required: true
        }
    },
    AdharImageBack: {
        url: {
            type: String,
            // required: true
        },
        public_id: {
            type: String,
            // required: true
        }
    },
    PanImage: {
        url: {
            type: String
        },
        public_id: {
            type: String
        }
    }
})

VendorSchema.index({ 'address.location': '2dsphere' });
VendorSchema.index({ number: 1 });

const Vendor = mongoose.model('Vendor', VendorSchema)
module.exports = Vendor;