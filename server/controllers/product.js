const Product = require('../models/product');
const slugify = require('slugify');
const user = require('../models/user');

exports.create = async(req, res) => {
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (err) {
        console.log(err);
        //res.status(400).send("Create product failed");
        res.status(400).json({
            err: err.message,
        });
    }
};

exports.listAll = async(req, res) => {
    let products = await Product.find({})
    .limit(parseInt(req.params.count)) // this limits the number of products we display ... needs to be a number!
    .populate('category')
    .populate('subs')
    .sort([['createdAt', 'desc']]) // fetches based on the latest item created, in descending order!
    .exec();
    res.json(products);
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndRemove({
            slug: req.params.slug, 
        }).exec();
        res.json(deleted);
    } catch (err) {
        console.log(err)
        return res.status(400).send('Product delete failed');
    }
};

exports.read = async (req, res) => {
    const product = await Product.findOne({slug: req.params.slug})
    .populate('category')
    .populate('subs')
    .exec();
    res.json(product);
};

exports.update = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updated = await Product.findOneAndUpdate(
            {slug: req.params.slug}, 
            req.body, 
            {new: true}
        ).exec();
        res.json(updated);
    } catch (err) {
        console.log('PRODUCT UPDATE ERROR ----->', err);
        res.status(400).json({
            err: err.message,
        });
    }
};


// WITHOUT PAGINATION!
// exports.list = async (req, res) => {
//     try {
//         // createdAt/updatedAt, descending/ascending, 3
//         const { sort, order, limit } = req.body;
//         const products = await Product.find({ })
//         .populate('category')
//         .populate('subs')
//         .sort([[sort, order]])
//         .limit(limit)
//         .exec();

//         res.json(products);
//     } catch (err) {
//         console.log(err)
//     }
// }


// WITH PAGINATION!
exports.list = async (req, res) => {
    // console.log(req.body);
    try {
        // createdAt/updatedAt, descending/ascending, 3
        const { sort, order, page } = req.body;
        const currentPage = page || 1;  // if there are no pages to show, set at one!
        const perPage = 3; // displays only a set number of items per page


        const products = await Product.find({ })
        .skip((currentPage - 1) * perPage)
        .populate('category')
        .populate('subs')
        .sort([[sort, order]])
        .limit(perPage)
        .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();  // estDocCt is mongoose based function
    res.json(total);
};

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();  // queries the database to find the product
    const user = await User.findOne({ email: req.user.email }).exec(); // queries the database to find the user
    const {star} = req.body;  //destructure the star rating from our request

    //who is updating
    // check if currently logged in user has already added a rating to this product?  if so, we update, if not, we create
    let existingRatingObject = product.ratings.find(
        (ele) => (ele.postedBy.toString() === user._id.toString()
        ));  // if user has previously rated, we'll find a match! otherwise it will be undefined.
        
    // if user has not left a rating previously...
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
            product._id, 
            {
                $push: { ratings: { star: star, postedBy: user._id} },
            }, 
            {new: true }  // without this, the above function will only send to database! we need this to send to our frontend as well!
        ).exec();
        console.log("rating added", ratingAdded);
        res.json(ratingAdded);
    } else {
        // if user has already left a rating, we update...
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elementMatch: existingRatingObject },
            }, 
            {$set: {"ratings.$.star": star } }, 
            {new: true}  // without this, the above function will only send to database! we need this to send to our frontend as well!
        ).exec();
        console.log('ratingUpdated', ratingUpdated);
        res.json(ratingUpdated);
    }
};