import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        trim: true,
        maxLength: [30, "Name should not exceed 30 characters"],
        minLength: [4, "Name should have minimum 4 characters"]
    },
    email: {
        type: String,
        required: [true, "please provide email"],
        validate: [validator.isEmail, "Please provide valid email"],
        unique:true
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minLength: [8, "Password should contains minimum 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String, 
    resetPasswordExpire:String
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.SECRET,{expiresIn:process.env.EXPIRE})
}

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire=Date.now()+15*60*60
    return resetToken
}
export default mongoose.model('User',userSchema)