import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide Productname'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'please provide description']
    },
    price: {
        type: Number,
        required: [true, 'please provide price'],
        maxlength: [8, 'price should not exceed 8 characters']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: [true, 'please provide image id']
        },
        url: {
            type: String,
            required: [true, 'please provide image url']
        }
    }
    ],
    category: {
        type: String,
        required: [true, 'please provide category']
    },
    stock: {
        type: Number,
        required: [true, 'please provide Stock'],
        maxlength: [4, 'Stock should not exceed 4 characters']
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [

        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: [true, 'please provide reviewr name']
            },
            rating: {
                type: Number,
                required: [true, 'please provide rating']
            },
            comment: {
                type: String,
                required: [true, 'please provide comment']
            }

        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Product', productSchema)