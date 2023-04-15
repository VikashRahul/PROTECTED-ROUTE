const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config();

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        requires: true
    },
    email:{
        type: String,
        requires: true
    },
    phone:{
        type: String,
        requires: true
    },
    password:{
        type: String,
        requires: true
    },
    cpassword:{
        type: String,
        requires: true
    },
    tokens: [
        {
            token:{
                type: String,
                requires: true
            }
        }
    ]
})



//hashing password

userSchema.pre('save', async function(next) {
    console.log("hi from hash")
    if(this.isModified('password'))
    {
        this.password= await bcrypt.hash(this.password, 12);
        this.cpassword=await bcrypt.hash(this.cpassword, 12);
    
    }
    next();
})

//generating token
userSchema.methods.generateAuthToken = async function()
{
    try{
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;

    }catch(err){
        console.log(err);
    }
}

const User = mongoose.model('USER', userSchema);

module.exports = User;