const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const catchAsyncErorrs=require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
exports.strinfyObject = (req, res, next) => {
    const obj = JSON.stringify(req.body);
    res.status(200).json({obj});
}
exports.addNewOrder= catchAsyncErorrs(async(req, res, next) => {
        const {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        } = req.body;
        const order =  await Order.create({
            shippingInfo,
            orderItems,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paidAt:Date.now(),
            user: req.user._id 
    })
       
        
        res.status(200).json({
                success: true,
                message: 'Order saved successfully',
                order

        });
})

exports.getSingleOrder= catchAsyncErorrs(async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(`Order with  ID '${req.params.id}' is not found`,404));
    }

    res.status(200).json({
        success: true,
        order
    })
})  
exports.myOrders= catchAsyncErorrs(async(req, res, next) => {
    const orders = await Order.find({user:req.user.id});

    res.status(200).json({
        success: true,
        count: orders.length,
        orders
    })
})
exports.getAllOrders = catchAsyncErorrs( async(req, res, next) => {
    let totalAmount = 0;
    const orders = await Order.find()
    orders.forEach(order => totalAmount += order.totalPrice)
    res.status(200).json({
        success: true,
        count: orders.length,
        totalAmount,
        orders
    })
})

exports.orderProcess = catchAsyncErorrs( async(req, res, next) => {
    const order = await Order.findById(req.params.id)
   
    if (order.orderStatus === 'delivered') next(new ErrorHandler('Order has already been delivered',400))

    order.orderItems.forEach(async (item) =>{
    
        //const product = await Product.findById(item.id)
   //     if (item.product.stock > item.quantity){
     await updateStock(item.product,item.quantity);

        
       //  next(new ErrorHandler(`this item is currently out of stock`,400))
    });

    order.orderStatus = req.body.status;
    order.deliveredAt= Date.now();
    await order.save();
    
    res.status(200).json({
        success: true,
       message : 'products stocks has been updated successfully'
    })
})


async function updateStock (id,quantity){
        const product = await Product.findById(id)
  
        product.stock = product.stock - quantity
        await product.save()
    
        
      }

      exports.deleteOrder= catchAsyncErorrs(async(req, res, next) => {
        const order = await Order.findById(req.params.id);
        if(!order){
            return next(new ErrorHandler(`Order with  ID '${req.params.id}' is not found`,404));
        }
        order.remove()
    
        res.status(200).json({
            success: true,
            message: 'Order has been removed successfully'
        })
    })