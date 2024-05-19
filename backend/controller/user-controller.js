import * as service from "../services/user-service.js";
import bcrypt from "bcrypt";

export const register = async (request, response) => {
    try {
        const { name, email, mobileNumber, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                success: false,
                message: "Please enter All fields",
            });
        }

        let passwordStr = password.toString();

        // let mobileNumberStr = mobileNumber.toString();
        // let validNumber = true;
        // let moblieNumberLen = mobileNumberStr.length;

        // for (let i = 0; i < moblieNumberLen; i++) {
        //     if (!(mobileNumberStr[i] >= '0' && mobileNumberStr[i] <= '9')) {
        //         validNumber = false;
        //     }
        // }

        // if (!validNumber || moblieNumberLen !== 10) {
        //     return response.status(400).json({
        //         success: false,
        //         message: "Invalid Mobile number",
        //     });
        // }

        if (passwordStr.length < 6) {
            return response.status(400).json({
                success: false,
                message: "Password must be greater than 6 characters",
            });
        }

        const user = await service.getOneByEmail(email);

        if (user) {
            return response.status(409).json({
                success: false,
                message: "User already Exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log({ name, email, password, hashedPassword });

        const newUser = await service.createUser({
            name,
            email,
            password: hashedPassword,
        });

        const userInfo = {
            name: newUser.name,
            email: newUser.email,
            _id: newUser._id
        };

        return response.status(200).json({
            success: true,
            message: "User created successfully",
            user: userInfo
        });

    } catch (err) {
        return response.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const login = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                success: false,
                message: "Please enter All fields",
            });
        }

        const user = await service.getOneByEmail(email);

        if (!user) {
            console.log(user);
            return response.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isBanned) {
            console.log(user);

            const currentTime = new Date();
            let timeDifference = Math.ceil(Math.abs(currentTime - user.banTime) / 36e5);

            if (timeDifference <= 2) {
                return response.status(403).json({
                    success: false,
                    message: "This account is already blocked!"
                });
            } else {
                const unbanned = await service.unbanUser(email);
            }
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return response.status(401).json({
                success: false,
                message: "Incorrect Credentials",
            });
        }

        const userInfo = {
            name: user.name,
            email: user.email,
            id: user._id
        };

        return response.status(200).json({
            success: true,
            message: `Welcome back ${user.name}`,
            user: userInfo
        });

    } catch (err) {
        return response.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const resetPassword = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                success: false,
                message: "Please enter All fields",
            });
        }

        const user = await service.getOneByEmail(email);

        if (!user) {
            console.log(user);
            return response.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await service.updateUserByEmail(email, {
            password: hashedPassword
        });

        return response.status(200).json({
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: err.message
        });
    }
}