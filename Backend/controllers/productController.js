import Product from "../models/productmodel.js"
import catchAsyncErrors from "../utils/catchAsyncErrors.js"
import Errorhandler from "../utils/errorHandler.js"
import apiFeatures from "../utils/apiFeatures.js"
import cloudinary from 'cloudinary'

export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 4
    const TotalProducts = await Product.countDocuments()
    const noOfProducts = Number(TotalProducts)
    const apiFeature = new apiFeatures(Product.find(), req.query).search().filter()
    let products = await apiFeature.query
    let filteredProductsCount = products.length
    apiFeature.pagination(resultPerPage)
    products = await apiFeature.query.clone()
    res.status(200).json({ products, noOfProducts, resultPerPage, filteredProductsCount })
})

export const createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(201).json({ success: true, product })
})

export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new Errorhandler("product not found", 404))
    }
    res.status(200).json({ product })
})

export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
})

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    console.log(product)
    if (!product) {
        return next(new Errorhandler("product not found", 404))
    }

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({ success: true, product })
})

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new Errorhandler("product not found", 404))
    }
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: "Product Delete Successfully" })
})

export const createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { ProductId, rating, comment } = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(ProductId)
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating),
                    (rev.comment = comment)
        })

    } else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }
    let avg = 0
    product.reviews.forEach(rev => {
        avg += rev.rating
    })
    product.ratings = avg / product.reviews.length
    await product.save({ validateBeforeSave: false })
    res.status(200).json({ success: true })
})

export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id)
    if (!product) {
        return next(new Errorhandler("Product not found", 400))
    }

    res.status(200).json({ success:true,reviews: product.reviews })
})

export const deleteProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)
    if (!product) {
        return next(new Errorhandler("Product not found", 400))
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    )

    let avg = 0
    reviews.forEach(
        (rev) => {
            avg += rev.rating
        }
    )
    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
    const numOfReviews = reviews.length
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews, ratings, numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }
    )
    res.status(200).json({ success: true })
})