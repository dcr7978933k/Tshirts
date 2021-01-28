const express=require("express")
const router=express.Router();

const {getProductById,createProduct,getProduct,photo,updateProduct,deleteProduct,getAllProducts,getAllUniqueCategories} = require("../controllers/product")
const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

//all of parmas
router.param("productId",getProductById)
router.param("userId",getUserById)

//all of actual routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct)


//real routes
router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);

//delete route
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct)


//update route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct)


//listing route
router.get("/product",getAllProducts);

router.get("/products/categories",getAllUniqueCategories)
module.exports=router;


