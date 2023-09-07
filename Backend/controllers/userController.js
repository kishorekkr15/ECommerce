import Errorhandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../utils/catchAsyncErrors.js";
import User from '../models/userModel.js'
import { sendToken } from "../utils/jwtToken.js";
import sendMail from "../utils/sendMail.js";
import crypto from 'crypto'
import cloudinary from 'cloudinary'

export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale"
    })

    const emailAlreadyExists = await User.findOne({ email })
    if (emailAlreadyExists) {
        throw new Errorhandler("email already exists", 400)
    }
    const user = await User.create({
        name, email, password, avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })
    sendToken(user, 201, res)
})


export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new Errorhandler("Please provide email and password", 401))
    }
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new Errorhandler("Invalid Username", 401))
    }

    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
        return next(new Errorhandler("Invalid Password", 401))
    }

    sendToken(user, 200, res)
})

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({ message: "Logged out success" })
})

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new Errorhandler("user not found", 404))
    }

    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

    const message = `Your password reset token is :-\n\n ${resetPasswordUrl}\n\n if you have not requested please ignore this mail`

    try {
        await sendMail({
            email: user.email,
            subject: "ecommerce password recovery",
            message
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new Errorhandler(error.message, 500))
    }
    res.status(200).json({ message: "mail sent" })
})

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    console.log(resetPasswordToken)
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    console.log(user)
    if (!user) {
        return next(new Errorhandler("Reset password token is invalid or expire", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new Errorhandler("password does not match", 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    sendToken(user, 200, res)
})

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    // console.log(req.user.id)
    const vid = req.user.id
    // console.log(vid)
    const user = await User.findById(vid)
    // console.log(user)
    res.status(200).json({ user })
})

export const updateUserPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password")
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if (!isPasswordMatched) {
        return next(new Errorhandler("Old password is incorrect", 400))
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new Errorhandler("Password doess not match", 400))

    }
    user.password = req.body.newPassword
    await user.save()
    sendToken(user, 200, res)
})

export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id)
        const imageId = user.avatar.public_id
        await cloudinary.v2.uploader.destroy(imageId)
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        })
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({ success: true })
})

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({ users })
})

export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new Errorhandler("User not found", 400))
    }

    res.status(200).json({ user })
})

export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({ success: true })
})

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
        return next(new Errorhandler("User not found", 400))
    }
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);
    res.status(200).json({success:true, message: "User was deleted successfully" })
})
