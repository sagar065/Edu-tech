exports.contactUsEmail = (email, firstname, lastname, message, phoneNo, countrycode) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { background-color: #ffffff; font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #e4e4e4; }
            .header { font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #FFD60A; }
            .details { text-align: left; background-color: #f9f9f9; padding: 15px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Contact Form Confirmation</div>
            <div class="body">
                <p>Dear ${firstname} ${lastname},</p>
                <p>We have received your message and will respond shortly.</p>
                <div class="details">
                    <p><strong>Name:</strong> ${firstname} ${lastname}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${countrycode} ${phoneNo}</p>
                    <p><strong>Message:</strong> ${message}</p>
                </div>
            </div>
        </div>
    </body>
    </html>`
}