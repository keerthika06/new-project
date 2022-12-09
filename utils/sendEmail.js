var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
	host: "imappro.zoho.in",
	secure: true,
	port: 465,
	ignoreTLS: true,
	logger: true,
	debug: true,
	send: true,
	auth: {
		user: process.env.ZOHO_MAIL,
		pass: process.env.ZOHO_PASS,
	},
});

// const sendEmail = async (email, otp) => {
const sendEmail = async (email, subject, text) => {
	let mailOptions = {
		from: process.env.ZOHO_MAIL,
		to: email,
		// subject: "OTP verfication for password",
		// text: `To verify your email address, enter the below code in your Cricket App.
		// \n\n${otp}\n\nIf you didn’t request a code, you can safely ignore this email.
		// `,
		subject,
		text,
	};
	// console.log(mailOptions);
	await new Promise((resolve, reject) => {
		// verify connection configuration
		transporter.verify(function (error, success) {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				console.log("Server is ready to take our messages");
				resolve(success);
			}
		});
	});
	// TODO : check otp properly
	await new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				reject(err);
				// return false;
			}
			console.log("OTP SENT");
			console.log(
				"Email sent. Please check your Email Id: " + info.response
			);
			resolve(info);
			// return true;
		});
	});
	return true;
};

module.exports = { sendEmail };

//https://myaccount.google.com/lesssecureapps?pli=1
