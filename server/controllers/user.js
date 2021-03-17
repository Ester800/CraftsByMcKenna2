const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Coupon = require('../models/coupon');

exports.userCart = async (req, res) => {
    //console.log(req.body);
    const { cart } = req.body;

    let products = [];  // the existing cart doesn't have everything we need; ie: count, color...so we start fresh

    const user = await User.findOne({ email: req.user.email }).exec();

    // check if cart with logged in user id already exists - perhaps cart was filled on previous visit?
    let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id }).exec();

    if(cartExistByThisUser) {
        cartExistByThisUser.remove()
        //console.log('removed old cart');
    }

    // we loop through the new cart, adding the new properties (count, color) to each new object ... (updating each product)
    for (let i = 0; i < cart.length; i++) {   // each new object is then pushed to the products array
        let object = {}

        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;

        // get price for creating total
        let productFromDb = await Product.findById(cart[i]._id)
            .select('price')
            .exec();  // we query the database to avoid allowing the user access to the price (avoid user changing the price)
        
        object.price = productFromDb.price;

        products.push(object);
    }

    //console.log('products', products);
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;

    }

    //console.log('cartTotal', cartTotal);

    let newCart = await new Cart({
        products,
        cartTotal,
        orderedBy: user._id,
    }).save();

    console.log('new Cart ----> ', newCart)
    res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
    const user = await User.findOne({email: req.user.email}).exec();

    let cart = await Cart.findOne({ orderedBy: user._id })
        .populate('products.product', '_id title price totalAfterDiscount')
        .exec();

    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({ products, cartTotal, totalAfterDiscount });

};

exports.emptyCart = async (req, res) => {
    //console.log('empty cart');
    const user = await User.findOne({ email: req.user.email }).exec();

    const cart = await Cart.findOneAndRemove({orderedBy: user._id}).exec();
    res.json(cart);
};

exports.saveAddress = async (req, res) => {
    const userAddress = await User.findOneAndUpdate(
        {email: req.user.email}, 
        {address: req.body.address}
    )
    .exec();
    
    res.json({ ok: true });
};


exports.applyCouponToUserCart = async (req, res) => {
    const { coupon } = req.body;
    //console.log('COUPON', coupon);

    const validCoupon = await Coupon.findOne({ name: coupon }).exec()
    if (validCoupon === null) {
        return res.json({
            err: 'Invalid Coupon' 
        });
    }
    //console.log('VALID COUPON', validCoupon);
    const user = await User.findOne({ email: req.user.email }).exec();

    let { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
    .populate('products.product', '_id title price')
    .exec();

    console.log('cartTotal', cartTotal, 'discount %', validCoupon.discount);

    // calculate the total after discount
    let totalAfterDiscount = (
        cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);

    Cart.findOneAndUpdate(
        { orderedBy: user._id }, 
        { totalAfterDiscount }, 
        { new: true }
    );
    res.json(totalAfterDiscount);
};




