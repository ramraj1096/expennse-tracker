import NodeCache from "node-cache"
import nodemailer from "nodemailer"
import * as userService from "../services/user-service.js";

// cache to store the OTPs
const otpCache = new NodeCache({ stdTTL: 300 });

// generates random 6 digit OTP, and stores it to the cache
function generateOtp(key) {
    const min = 100000;
    const max = 999999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    otpCache.set(key, otp);
    return otp.toString();
}

// gets the OTP for respective key (email in out case)
function getOtp(key) {
    const res = otpCache.get(key);
    if (!res) return null;
    return res;
}

// removes the key, value pair of email and OTP from cache
function clearOtp(key) {
    otpCache.del(key);
}

export const sendEmail = async (request, response) => {
    try {

        const { email, name, useCase } = request;
        let htmlTemplate = `<h1>Error</h1>`;
        const otp = useCase !== "blockEmail" ? request.otp : "";
        let subjectMessage = "";

        if (useCase === "register") {
            subjectMessage = "OTP for Registering - Wallet Watch!"
            htmlTemplate = `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">WalletWatch</a>
                    </div>
                    <p style="font-size:1.1em">Hi ${name},</p>
                    <p>Thank you for registering for WalletWatch. Use the following OTP to complete your Registration procedure. OTP is valid for 5 minutes</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                    <p style="font-size:0.9em;">Regards,<br />WalletWatch</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                </div>
            </div>
            `
        } else if (useCase === "login") {
            subjectMessage = "OTP for Login - Wallet Watch!"
            htmlTemplate = `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">WalletWatch</a>
                    </div>
                    <p style="font-size:1.1em">Hi ${name},</p>
                    <p>Thank you for choosing WalletWatch. Use the following OTP to complete your Login procedure. OTP is valid for 5 minutes</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                    <p style="font-size:0.9em;">Regards,<br />WalletWatch</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                </div>
            </div>
            `
        } else if (useCase === "resetPassword") {
            subjectMessage = "OTP for Reseting Password - Wallet Watch!"
            htmlTemplate = `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">WalletWatch</a>
                    </div>
                    <p style="font-size:1.1em">Hi ${name},</p>
                    <p>Thank you for choosing WalletWatch. Use the following OTP to reset your password. OTP is valid for 5 minutes</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                    <p style="font-size:0.9em;">Regards,<br />WalletWatch</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                </div>
            </div>
            `
        } else {
            subjectMessage = "Account Blocked! - Wallet Watch"
            htmlTemplate = `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">WalletWatch</a>
                    </div>
                    <p style="font-size:1.1em">Hi ${name},</p>
                    <p>There has been a failed login attempt. Your account has been temporily blocked for 2 hours.</p>
                    <p style="font-size:0.9em;">Regards,<br />WalletWatch</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                </div>
            </div>
            `
        }

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        var mailOptions = {
            to: email,
            subject: subjectMessage,
            html: htmlTemplate,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return response.status(500).json({
                    success: false,
                    message: error.message,
                });
            }

            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });

    } catch (error) {
        console.log(error.message);
        return response.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const sendOTP = async (request, response) => {
    try {
        const { email, useCase } = request.body;
        const isLogin = request.body.isLogin;
        let userName = request.body?.name;

        if (!email) {
            return response.status(400).json({
                success: false,
                message: "Please give email",
            })
        }

        const userExists = await userService.getOneByEmail(email);

        if (!isLogin) {
            if (userExists) {
                return response.status(409).json({
                    success: false,
                    message: "User already Exists",
                });
            }
        } else {
            userName = userExists.name;
        }

        const otp = generateOtp(email);
        console.log("OTP generated: ", otp);

        await sendEmail({
            email: email,
            name: userName,
            otp: otp,
            useCase: useCase
        }, response);

        const obj = {
            "otp": otp,
        }

        if (isLogin) {
            let options = [];
            const min = 100000;
            const max = 999999;

            for (let i = 0; i < 3; i++) {
                const currentOtp = Math.floor(Math.random() * (max - min + 1)) + min;
                options.push(currentOtp.toString());
            }

            options.push(otp);

            for (let i = 100; i > 0; i--) {
                let j = (Math.floor(Math.random() * (i + 1))) % 4;
                [options[i % 4], options[j]] = [options[j], options[i % 4]];
            }

            obj.options = options;
        }

        return response.status(200).json({
            success: true,
            otpInfo: obj,
            message: "OTP sent successfully",
        });

    } catch (err) {
        console.log(err.message);
        return response.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

export const verifyOTP = async (request, response) => {
    try {
        const { email, otp, isBanAllowed } = request.body;

        // error handling
        if (!email || !otp) {
            return response.status(400).json({
                success: false,
                message: "Please give Email and OTP",
            });
        }

        // converting the user entered otp to integer
        const userOtp = parseInt(otp, 10);

        // this is the correct OTP, fetching from cache
        const correctOtp = getOtp(email);

        console.log({
            "email": email,
            "userOTP": userOtp,
            "correctOTP": correctOtp
        });

        // is OTP is expired after some time, or already verified
        if (!correctOtp || correctOtp === undefined) {
            return response.status(400).json({
                success: false,
                message: "OTP is expired",
            });
        }

        const isValid = (userOtp === correctOtp);

        if (isValid) {
            clearOtp(email);
        }

        if (isValid) {
            return response.status(200).json({
                success: true,
                message: "OTP Verified Successfully"
            });
        } else if (isBanAllowed) {

            const user = await userService.getOneByEmail(email);
            const name = user.name;
            const banned = await userService.banUser(email);

            await sendEmail({
                email: email,
                name: name,
                useCase: "blockEmail"
            }, response);

            return response.status(200).json({
                success: false,
                message: "Invalid OTP! You Account has been blocked!"
            });
        }

        return response.status(200).json({
            success: false,
            message: "Invalid OTP"
        });

    } catch (err) {
        return response.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

/*
this is the first draft of the code to send otp via SMS
as Fast2SMS service is paid, this part is not tested yet

export const sendOTPsms = async (request, response) => {
    try {
        const { mobileNo } = request.body;
        console.log("number: ", mobileNo);

        const temp = await fast2sms.sendMessage({
            authorization: "Y4VFwLoi6XErlcCAwfNo5BvE3R7k0ZkrzECq0lTkKidJKyashbbX59GI0Xqc",
            message: "Your otp is 123",
            numbers: [mobileNo]
        });

        console.log(temp);

        response.status(200).json({
            status: true,
            message: temp
        });
    } catch (err) {
        console.log("here");
        return response.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

*/
