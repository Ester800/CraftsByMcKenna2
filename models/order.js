const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} =mongoose.Schema;

const orderSchema = new mongoose.Schema(
    {
    products: [
        {
            product: {
                type: ObjectId,
                ref: "Product"
            },
            count: Number,
            color: String,
        },
    ],
    paymentIntent: {},
        orderStatus: {
            type: String,
            default: 'Not Processed',
            enum: [  // enum ensures that whatever is coming from the front end matches what is in the backend
                'Not Processed',
                'Processing',
                'Dispatched',
                'Cancelled',
                "Completed",
            ],
        },
        orderedBy: {type: ObjectId, ref: 'User'},
    }, 
    {
        timestamps: true
    });

module.exports = mongoose.model('Order', orderSchema);
