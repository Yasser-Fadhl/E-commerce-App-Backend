const express = require('express');
const router = express.Router();
const {addNewOrder,getSingleOrder,myOrders, getAllOrders,deleteOrder, orderProcess}  = require('../controllers/orderController')
const {isAuthenticated, authorizedRoles}= require('../middlewares/auth')

router.route('/order/new').post(isAuthenticated,addNewOrder)
router.route('/order/:id').get(isAuthenticated,getSingleOrder)
router.route('/me/orders').get(isAuthenticated,myOrders)
router.route('/admin/orders').get(isAuthenticated, authorizedRoles('admin'),getAllOrders)
router.route('/admin/orders/:id').get(isAuthenticated, authorizedRoles('admin'),orderProcess)
                                 .delete(isAuthenticated, authorizedRoles('admin'),deleteOrder)
module.exports=router;