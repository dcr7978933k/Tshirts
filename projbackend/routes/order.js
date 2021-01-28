const express=require("express")
const router=express.Router();
const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth")
const {getUserById,pushOrderInPurchaseList} = require("../controllers/user")
const {createOrder,getAllOrders,updateStatus,getOrderStatus}= require("../controllers/order")
const {updateStock} = require("../controllers/product");
const { model } = require("../models/user");


//params
router.params("userId",getUserById);
router.params("orderId",orderId)


//Actual Routs
//create
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder)

//read
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)

//status o order
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)
router.put("/order/:order/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)

module.exports=router;
