const Product = require('../models/product');
const slugify = require('slugify');
const User = require('../models/user');

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

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();

    const related = await Product.find({
        _id: { $ne: product._id },  // $ne means not including
        category: product.category,
    })
    .limit(3)
    .populate('category')
    .populate('subs')
    .populate('postedBy')
    .exec();

    res.json(related);
};

const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query } })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

    res.json(products);
};

const handlePrice = async (req, res, price) => {
    try{
        let products = await Product.find({
            price: {
                $gte: price[0],   // $gte is GreaterThan from mongoose
                $lte: price[1],   // $lte is LessThan from mongoose
            }
        })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }   
};

const handleCategory = async(req, res, category) => {
    try {
        let products = await Product.find({ category })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const handleStar = (req, res, stars) => { 
    Product.aggregate([
        {
            $project: {             // $project (aggregation) in order to acquire the average star rating...
                document: '$$ROOT',  // gives us access to the entire document - with this we don't need to relist entire field
                floorAverage: {
                $floor: { $avg: '$ratings.star' }          // $ replaces Math.()
                },
            },
        }, 
        { $match: { floorAverage: stars } }    
    ])
    .limit(12)
    .exec((err, aggregates) => {
        if(err) console.log('AGGREGATE ERROR', err)
        Product.find({ _id: aggregates })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, products) => {
            if(err) console.log('PRODUCT AGGREGATE ERROR', ERR);
            res.json(products);
        });
    });                                      
};       

// SEARCH / filters
exports.searchFilters = async (req, res) => {
    const { query, price, category, stars } = req.body;

    if(query) {
        //console.log('query', query);
        await handleQuery(req, res, query);
    }

    
    if(price !== undefined) {
        //console.log('price ----> ', price)
        await handlePrice(req, res, price); 
    }

    if(category) {
        //console.log('category -----> ', category);
        await handleCategory(req, res, category);
    }

    if(stars) {
        //console.log('stars ----> ', stars);
        await handleStar(req, res, stars);
    }
};