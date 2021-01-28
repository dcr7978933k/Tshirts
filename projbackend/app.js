require('dotenv').config()
const mongoose = require('mongoose');
const express=require('express');
const app=express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors');

//my routs
const authRoutes=require("./routes/auth");
const userRoutes=require("./routes/user");
const catagoryRoutes=require("./routes/category");
const productsRoutes=require("./routes/product");
const orderRoutes=require("./routes/order");


//DB connnection
mongoose.connect
(process.env.DATABASE, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true

}).then(()=>{
    console.log("db is connected");
}).catch(()=>{
    console.log("db got oops");
});

//middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//my Routes
app.use("/api", authRoutes);
app.use("/api",userRoutes);
app.use("/api",catagoryRoutes);
app.use("/api",productsRoutes);
app.use("/api",orderRoutes);




//Port
const port=process.env.PORT || 9000;
//starting a server
app.listen(port,()=>{
    console.log(`app is running ${port}`);
});