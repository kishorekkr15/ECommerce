import Order from "../models/orderModel.js"
import Errorhandler from "../utils/errorHandler.js"
import catchAsyncErrors from "../utils/catchAsyncErrors.js"
import Product from "../models/productmodel.js"

export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    const order = await Order.create({ shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user._id })

    res.status(201).json({ order })
})

export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user")
    if (!order) {
        return next(new Errorhandler("error", 404))
    }
    res.status(200).json({ order })
})

export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })
    res.status(200).json({ orders })
})

export const getAlOrder = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()
    let TotalAmount = 0
    orders.forEach((ord) => {
        TotalAmount += ord.totalPrice
    })

    res.status(200).json({ TotalAmount, orders })
})

export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (order.orderStatus === "Delivered") {
        return next(new Errorhandler("Order has been delivered", 500))
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (ord) => {
            await updateStock(ord.product, ord.quantity)
            console.log(ord.product)
        })
    }

    order.orderStatus = req.body.status

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now()
    }
    await order.save({ validateBeforeSave: false })
    res.status(200).json({ success: true })

})

async function updateStock(id, quantity) {
    const product =await Product.findById(id)
    product.stock -= quantity
    await product.save({ validateBeforeSave: false })
}

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    await Order.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true })
})