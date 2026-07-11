const bcrypt = require("bcrypt")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const Profile = require("../models/Profile")
require("dotenv").config()

// ==========================================
// 1. Send OTP Controller
// ==========================================
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body

    // Check if user is already present
    const checkUserPresent = await User.findOne({ email })

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is Already Registered",
      })
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    // Check uniqueness of OTP in DB
    let result = await OTP.findOne({ otp: otp })

    // FIXED: Now updating 'result' inside the loop to prevent hanging
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      result = await OTP.findOne({ otp: otp })
    }

    const otpPayload = { email, otp }

    // This 'create' call triggers the .pre('save') hook in your OTP model to send the email
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body created:", otpBody)

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    })
  } catch (error) {
    console.log("Error in sendotp:", error.message)
    return res.status(500).json({ 
        success: false, 
        message: "OTP could not be sent",
        error: error.message 
    })
  }
}

// ==========================================
// 2. Signup Controller
// ==========================================
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body

    // Validate fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match. Please try again.",
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    // Find the most recent OTP for the email
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    
    if (recentOtp.length === 0 || otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Handle Instructor Approval logic
    let approvedStatus = accountType === "Instructor" ? false : true

    // Create Profile (Additional Details)
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    })

    // Create User
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      approved: approvedStatus,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
}

// ==========================================
// 3. Login Controller
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill up all the required fields",
      })
    }

    const user = await User.findOne({ email }).populate("additionalDetails")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered. Please sign up to continue.",
      })
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      )

      user.token = token
      user.password = undefined

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Login Successful",
      })
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Login Failure. Please try again.",
    })
  }
}

// ==========================================
// 4. Change Password Controller
// ==========================================
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id)
    const { oldPassword, newPassword } = req.body

    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password)
    if (!isPasswordMatch) {
      return res.status(401).json({ 
          success: false, 
          message: "The old password is incorrect" 
      })
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send Email
    try {
      await mailSender(
        updatedUserDetails.email,
        "Password Updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName}`
        )
      )
    } catch (error) {
      console.error("Error sending email:", error)
      // We don't necessarily want to fail the whole request if email fails, 
      // but in this project, we return a 500.
      return res.status(500).json({
        success: false,
        message: "Password updated but email failed",
        error: error.message,
      })
    }

    return res.status(200).json({ 
        success: true, 
        message: "Password updated successfully" 
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
    })
  }
}