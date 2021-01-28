const express=require("express");
const app=express();
const port=9000
const lorr = require('watch-api');
// app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })
  
//   app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
//   })
const login=(req,res)=>{
    return res.send("u r visiting login dashboard");
}
const admin=(req,res)=>{
    return res.send("u r visiting admin dashboard");
}
const isAdmin=(req,res,next)=>{
   console.log("is admin ........");
    next();
}
app.use(lorr);
app.get("/login", login);
app.get("/admin",isAdmin, admin);
app.get("/signup", (req,res)=>{
    return res.send("u r visiting signup");
});

app.listen(port,()=>{
    console.log("server is up n runnung...");
});