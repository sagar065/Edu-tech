// 1. Template for the RESET LINK email
exports.passwordReset = (url, name) => {
	return `<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<title>Password Reset Request</title>
		<style>
			body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #333333; margin: 0; padding: 0; }
			.container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
			.logo { max-width: 200px; margin-bottom: 20px; }
			.message { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
			.body { font-size: 16px; margin-bottom: 20px; }
			.cta {
				display: inline-block;
				padding: 12px 24px;
				background-color: #FFD60A;
				color: #000814;
				text-decoration: none;
				border-radius: 8px;
				font-weight: bold;
				margin-top: 20px;
			}
			.support { font-size: 14px; color: #999999; margin-top: 20px; }
		</style>
	</head>
	<body>
		<div class="container">
			<a href="https://studynotion-edtech-project.vercel.app"><img class="logo" src="https://i.ibb.co/spx86vxF/logo.png" alt="StudyNotion Logo"></a>
			<div class="message">Password Reset Request</div>
			<div class="body">
				<p>Hey ${name ? name : "User"},</p>
				<p>We received a request to reset your password for your StudyNotion account.</p>
				<p>Please click the button below to set a new password. This link is valid for 1 hour.</p>
				<a href="${url}" class="cta">Reset Password</a>
			</div>
			<div class="support">If you did not request this, please ignore this email.</div>
		</div>
	</body>
	</html>`;
};

// 2. Template for the CONFIRMATION email (Your existing code)
exports.passwordUpdated = (email, name) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Update Confirmation</title>
        <style>
            body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #333333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
            .logo { max-width: 200px; margin-bottom: 20px; }
            .message { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
            .body { font-size: 16px; margin-bottom: 20px; }
            .support { font-size: 14px; color: #999999; margin-top: 20px; }
            .highlight { font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="https://studynotion-edtech-project.vercel.app"><img class="logo" src="https://i.ibb.co/spx86vxF/logo.png" alt="StudyNotion Logo"></a>
            <div class="message">Password Update Confirmation</div>
            <div class="body">
                <p>Hey ${name},</p>
                <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.</p>
                <p>If you did not request this password change, please contact us immediately to secure your account.</p>
            </div>
            <div class="support">Reach out at <a href="mailto:studynotionedtech.info@gmail.com">studynotionedtech.info@gmail.com</a>.</div>
        </div>
    </body>
    </html>`;
};