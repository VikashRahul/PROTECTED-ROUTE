const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const mongoose = require('mongoose');

const DB = 'mongodb+srv://aptaskvr:Ixtxkvm5STj1YrRx@cluster0.boz0p8d.mongodb.net/mernstack?retryWrites=true&w=majority'
mongoose.connect(DB).then(()=>{
    console.log('connection successful');
}).catch((err)=>console.log('no connection'));


// const User = require('./model/userSchema');
app.use(express.json());
app.use(cookieParser());

app.use(require("./router/auth"));

// const middleware=(req,res,next)=>{
//     console.log("hello middleware here")
//     next();
// }

// app.get("/", (req,res)=>{
//     res.send("app is working fine");
// });

// app.get("/about",(req,res)=>{
//     console.log("hello about");
//     res.send("about page");
// });

// app.get("/contact", (req,res)=>{
//     res.cookie("newtry",'vikash');
//     res.send("contact page");
// });

// app.get("/signup", (req,res)=>{
//     res.send("signup page");
// });

// app.get("/signin", (req,res)=>{
//     res.send("signin page ");
// });

app.listen(5000, ()=>{
    console.log('running on port no. 5000')
});