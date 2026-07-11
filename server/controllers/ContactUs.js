const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");

// Helper function for a professional Admin UI in Gmail
const renderAdminEmail = (firstname, lastname, email, countrycode, phoneNo, message) => {
  // Fix for the double ++ issue
  const cleanCountryCode = countrycode.startsWith('+') ? countrycode : `+${countrycode}`;
  
  return `
    <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f4f7f6; padding: 30px 10px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background-color: #000b1a; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">New Inquiry Received</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #555;">You have a new lead from your website contact form. Here are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #000b1a; width: 30%;">Full Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${firstname} ${lastname}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #000b1a;">Email Address</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #000b1a;">Phone Number</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${cleanCountryCode} ${phoneNo}</td>
            </tr>
          </table>

          <div style="margin-top: 20px;">
            <p style="font-weight: bold; color: #000b1a; margin-bottom: 8px;">Message:</p>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 5px solid #000b1a; font-style: italic; color: #444;">
              "${message}"
            </div>
          </div>

          <div style="margin-top: 30px; text-align: center;">
             <a href="mailto:${email}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reply to Lead</a>
          </div>
        </div>

        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #999;">
          This email was generated automatically by your Contact Us form.
        </div>
      </div>
    </div>
  `;
};

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;

  if (!email || !firstname || !message) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing.",
    });
  }

  try {
    await Promise.all([
      // 1. User Confirmation
      mailSender(
        email,
        "We've Received Your Message",
        contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
      ),

      // 2. Admin Notification (Improved UI + Fixed Phone logic)
      mailSender(
        process.env.MAIL_USER,
        `New Lead: ${firstname} ${lastname}`,
        renderAdminEmail(firstname, lastname, email, countrycode, phoneNo, message)
      ),
    ]);

    return res.status(200).json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error) {
    console.error("Email Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};