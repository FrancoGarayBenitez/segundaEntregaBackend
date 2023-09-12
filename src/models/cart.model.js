const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
    title: String,
    products: {
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                },
                product_sku: {type: String, required: true},
                quantity: { type: Number, default: 1}
            }
        ],
        default: []
    }   
})

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = {cartModel};
