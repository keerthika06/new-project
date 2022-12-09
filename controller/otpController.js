const { User } = require("../models/index");
const { sendEmail } = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const { internalServerError } = require("../utils/commonErrors");
const { totp } = require("otplib");
const constants = require("../utils/constants");
totp.options = { step: 300, digits: 4 }; // valid for 5min
const bcrypt = require("bcrypt");

const generateOTP = async (req, res) => {
	const { email } = req.query;

	try {
		const userFound = await User.findOne({ email });
		if (!userFound) {
			return res.status(401).json({
				status: false,
				statusCode: 401,
				message: "User does not exist",
			});
		} else {
			const secret = process.env.OTP_SECRET_KEY + email;
			const token = totp.generate(secret); // OTP number

			const subject = "OTP verfication for password";
			const text = `To verify your email address, enter the below code in your Cricket App.
		\n\n${token}\n\nIf you did not request a code, you can safely ignore this email.
		`;

			// const mailSent = await sendEmail(email, token);
			const mailSent = await sendEmail(email, subject, text);
			console.log(mailSent);
			const timeRemaining = totp.timeRemaining();
			mailSent
				? res.status(200).json({
						status: true,
						statusCode: 200,
						message: "Sent otp",
						data: timeRemaining,
				  })
				: res.status(502).json({
						status: false,
						statusCode: 502,
						message: "Couldn't send OTP",
				  });
		}
	} catch (error) {
		console.log("Error from generating otp", error);
		internalServerError(res, error);
	}
};

const verifyOTP = async (req, res, next) => {
	try {
		const { token, email } = req.body;
		const secret = process.env.OTP_SECRET_KEY + email;
		// totp.options = { step: 50 };

		console.log(totp.timeRemaining(), secret);

		const isValid = totp.verify({ token: token.toString(), secret });

		// if (isValid) return next();
		if (!isValid)
			return res.status(401).json({
				status: false,
				statusCode: 401,
				message: "Invalid OTP",
				data: { isValid },
			});

		// TODO : Check db email exists and 5min expire jwt
		const userFound = await User.findOne({ email });
		if (!userFound)
			return res.status(401).json({
				status: false,
				statusCode: 401,
				message: "User does not exist",
			});

		const otpVerificationToken = jwt.sign(
			{ email },
			process.env.OTP_TOKEN_SECRET,
			{ expiresIn: "5m" }
		);

		const timeRemaining = totp.timeRemaining(); // for resend OTP

		res.header("OTP-VERIFICATION-TOKEN", otpVerificationToken); // To verify when reset password is hit
		res.status(200).json({
			status: true,
			statusCode: 200,
			message: "Token is valid",
			data: { isValid, timeRemaining },
		});
	} catch (error) {
		console.log("Error from verify otp", error);
		internalServerError(res, error);
	}
};

const resetPassword = async (req, res) => {
	try {
		// console.log(req.headers);
		const otpHeader = req.headers["otp-verification-token"];
		if (!otpHeader)
			return res.status(401).json({
				status: false,
				statusCode: 401,
				message: "No otp verification header",
			});

		console.log(otpHeader);
		const { password, email } = req.body;

		jwt.verify(
			otpHeader,
			process.env.OTP_TOKEN_SECRET,
			async (err, decoded) => {
				if (err)
					return res.status(403).json({
						status: false,
						statusCode: 403,
						message: "Invalid Token",
					}); //invalid token
				req.users = decoded.userId; // TODO : check what n all to be added to jwt
				console.log("verified", req.users);

				const hashedPassword = await bcrypt.hash(
					password.toString(),
					constants.SALT_ROUNDS
				);

				const user = await User.findOneAndUpdate(
					{ email },
					{ password: hashedPassword }
				);

				if (!user)
					return res.status(400).json({
						status: true,
						statusCode: 400,
						message: "Password could not be updated",
						// data: user,
					});
				res.status(200).json({
					status: true,
					statusCode: 200,
					message: "Password updated successfully",
					// data: user,
				});
			}
		);
	} catch (error) {
		console.log("Error from reset otp", error);
		internalServerError(res, error);
	}
};

module.exports = { generateOTP, verifyOTP, resetPassword };