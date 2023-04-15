const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const authenticate = require("../middleware/authenticate")

const DB = 'mongodb+srv://aptaskvr:Ixtxkvm5STj1YrRx@cluster0.boz0p8d.mongodb.net/mernstack?retryWrites=true&w=majority'
mongoose.connect(DB).then(()=>{
    console.log('connection successful');
}).catch((err)=>console.log('no connection'));


const User = require("../model/userSchema");

router.use(cookieParser());

router.get("/", (req,res)=>{
    res.send("app is working fine from auth");
});

//using async
// router.post("/register", async (req,res)=>{
    
//     const {name, email, phone ,password,cpassword} = req.body;
//     //res.json({message: req.body});
//     //console.log(req.body);
//     //res.send("mera register page")
//     // console.log(req.body.name);
//     // console.log(req.body.email);
//     // console.log(name);
//     // console.log(email);

//     if(!name || !email || !phone || !password|| !cpassword)
//     {
//         return res.status(422).json({error: "fill everything"});
//     }

//     User.findOne({eamil: email}) 
//     .then((userExist) =>{
//         if(userExist)
//         {
//             return res.status(422).json({error: "email already exist"});
//         }

//         const user =new User({name, email, phone ,password,cpassword});

//         user.save().then(()=>{
//             res.status(200).json({message: " successful"});
//         }).catch((err)=> res.status(500).json({error: " failed to register"}));
//     }).catch(err=>{console.log(err);});


// })

router.post("/register", async (req,res)=>{
    
    //console.log(req.body);
    const {name, email, phone ,password,cpassword} = req.body;

    if(!name || !email || !phone || !password|| !cpassword)
    {
        return res.status(422).json({error: "fill everything"});
    }

    try{
        const userExist = await User.findOne({email: email}) 
        
        if(userExist)
        {
            return res.status(422).json({error: "email already exist"});
        }
        else if(password != cpassword)
        {
            return res.status(422).json({error: "password doesn't match cpassword"});
        }
        else{
            const user =new User({name, email, phone ,password,cpassword});
         
           //hash the password here
           await user.save();
          res.status(201).json({message: "success"});

        }

    
    } catch(err)
    {
        console.log(err);

    }
    


});

//login route

router.post('/signin', async (req,res)=>{
    // console.log(req.body);
    // res.json({message: "awesome"})

    try{
        const { email, password} = req.body;

        if(!email || !password)
        {
            return res.status(400).json({error: "plz fill the data"})
        }

        const userLogin = await User.findOne({email:email});
        
        //console.log(userLogin);

        

        if(userLogin)
        {
            let token
            const isMatch = await bcrypt.compare(password,userLogin.password);

            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken",token, {
                expires: new Date(Date.now() + 10000000),
                httpOnly: true
            });
            
            if(!isMatch)
           {
            res.status(400).json({error: "invalid password"});
            } 
          else{
            res.json({message :"signin success"});

          }

        }
        else{
            res.status(400).json({error: "user not registered"});


        }


    }catch(err)
    {
        console.log(err);
    }
});

//about route
router.get("/about",authenticate, (req,res)=>{
    console.log("hello about");
    res.send(req.rootUser);
});

//logout route
router.get("/logout", (req,res)=>{
    console.log("user logged out");
    res.clearCookie('jwtoken', {path:'/'});
    res.status(200).send('user logged out');
});


module.exports=router;