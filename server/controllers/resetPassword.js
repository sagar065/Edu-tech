const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { passwordReset, passwordUpdated } = require("../mail/templates/passwordUpdate");

// Generate Reset Password Token and Send Email
exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: `This Email: ${email} is not Registered With Us. Enter a Valid Email.`,
            });
        }

        // Generate Token
        const token = crypto.randomBytes(20).toString("hex");

        // Update user with token and expiry time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000, // 1 hour expiry
            },
            { new: true }
        );

        console.log("DETAILS", updatedDetails);

        // Created the link (Fixed double slash)
        const url = `https://studynotionedtechapp.vercel.app/update-password/${token}`;

        // Send Email using the passwordReset template
        await mailSender(
            email,
            "Password Reset Link",
            passwordReset(url, user.firstName)
        );

        res.json({
            success: true,
            message: "Email Sent Successfully, Please Check Your Email to Continue Further",
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            success: false,
            message: `Some Error in Sending the Reset Message`,
        });
    }
};

// Reset Password in Database
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (confirmPassword !== password) {
            return res.json({
                success: false,
                message: "Password and Confirm Password Does not Match",
            });
        }

        // Find user by token and check if token is expired
        const userDetails = await User.findOne({ 
            token: token,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is Invalid or Expired, Please Regenerate Your Token",
            });
        }

        // Hash the new password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Update the password and CLEAR the token fields
        await User.findOneAndUpdate(
            { token: token },
            { 
                password: encryptedPassword,
                token: null,
                resetPasswordExpires: null 
            },
            { new: true }
        );

        // Send Confirmation Email using the passwordUpdated template
        await mailSender(
            userDetails.email,
            "Password Reset Successful",
            passwordUpdated(userDetails.email, userDetails.firstName)
        );

        res.json({
            success: true,
            message: `Password Reset Successful`,
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            success: false,
            message: `Some Error in Updating the Password`,
        });
    }
};