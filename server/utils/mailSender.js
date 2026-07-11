const nodemailer = require("nodemailer");


const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: `"StudyNotion || EdTech App" <sagarbhandari243@gmail.com>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });

        console.log("Email info: ", info);
        return info;
    } catch (error) {
        console.log("Error in mailSender: ", error.message);
        throw error;
    }
};

module.exports = mailSender;