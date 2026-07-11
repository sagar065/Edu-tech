const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // Document expires in 5 minutes
    },
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email from StudyNotion",
            emailTemplate(otp)
        );
        console.log("Email sent successfully: ", mailResponse.response);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

// Pre-save hook: Triggered BEFORE the document is saved to the DB
OTPSchema.pre("save", async function (next) {
    console.log("New document saved to database");

    // Only send an email when a new document is created
    if (this.isNew) {
        try {
            await sendVerificationEmail(this.email, this.otp);
        } catch (error) {
            console.error("Error in OTP pre-save hook:", error);
            // We call next(error) if we want to stop the save, 
            // or just next() if we want to save anyway.
        }
    }
    next();
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;