import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { Box, Button, Grid, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import validator from "validator";
import axios from "axios";
import { sendOtpApi, verifyOtpApi, resetPasswordApi } from "../utils/ApiRequests.js";
import { Navigate } from "react-router-dom";
import Header from "../Components/Header.js";

const ForgotPassword = () => {
    const [userInfo, updateUserInfo] = useState({
        email: "",
        password: "",
        rePassword: "",
        otp: "",
    });

    const [error, updateError] = useState(false);
    const [errorMessage, updateErrorMessage] = useState("");
    const [validEmail, updateValidEmail] = useState(false);
    const [isOtpSentToUser, updateIsOtpSentToUser] = useState(false);
    const [isEmailVerified, updateIsEmailVerified] = useState(false);
    const [displayIncorrectOTP, updateDisplayIncorrectOTP] = useState(false);
    const [passwordsMatch, updatePasswordsMatch] = useState(true);
    const [validPassword, updateValidPassword] = useState(true);
    const [showPassword, updateShowPassword] = useState(false);
    const [showRePassword, updateShowRePassword] = useState(false);
    const [redirect, updateRedirect] = useState(false);

    const handleChange = (e) => {
        updateError(false);
        updateErrorMessage("");
        updateUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleClickShowPassword = () => {
        updateShowPassword(!showPassword);
    };

    const handleClickShowRePassword = () => {
        updateShowRePassword(!showRePassword);
    };

    const handleSendOTP = async (e) => {

        e.preventDefault();
        updateError(false);
        updateErrorMessage("");

        updateDisplayIncorrectOTP(false);
        updateUserInfo({ ...userInfo, otp: "" });

        try {
            const response = await axios.post(sendOtpApi, {
                "email": userInfo.email,
                "isLogin": true,
                "useCase": "resetPassword"
            });

            console.log(response.data, response.status);

            if (response.data.success) {
                updateIsOtpSentToUser(true);
                updateError(false);
                updateErrorMessage("");
            } else {
                updateError(true);
                updateErrorMessage(response.data.message);
            }
        } catch (error) {
            updateError(true);
            updateErrorMessage(error.response.data.message);
        }
    };

    const handleVerifyEmailButton = async (e) => {
        e.preventDefault();
        updateError(false);
        updateErrorMessage("");

        try {
            const response = await axios.post(verifyOtpApi, {
                "email": userInfo.email,
                "otp": userInfo.otp,
                "isBanAllowed": false
            });

            console.log(response.data, response.status);

            if (response.data.success) {
                updateDisplayIncorrectOTP(false);
                updateIsEmailVerified(true);
            } else {
                updateDisplayIncorrectOTP(true);
                updateUserInfo({ ...userInfo, [userInfo.otp]: "" });
            }

            updateError(false);
            updateErrorMessage("");

        } catch (error) {
            updateError(true);
            updateErrorMessage(error.response.data.message);
        }
    };

    const handleResetPasswordButton = async (e) => {
        e.preventDefault();
        updateError(false);
        updateErrorMessage("");

        const response = await axios.post(resetPasswordApi, {
            "email": userInfo.email,
            "password": userInfo.password
        });

        console.log(response.data);

        if (response.data.success) {
            updateRedirect(true);
        } else {
            updateError(true);
            updateErrorMessage(response.data.message);
        }
    };

    useEffect(() => {
        if (userInfo.email?.length === 0 || validator.isEmail(userInfo.email)) {
            updateValidEmail(true);
        } else {
            updateValidEmail(false);
        }
    }, [userInfo.email]);

    useEffect(() => {
        const user = localStorage.getItem("user");
        console.log(user);
        if (user) {
            updateRedirect(true);
        }
    }, []);

    useEffect(() => {
        if (isEmailVerified && userInfo.password && userInfo.rePassword) {
            if (userInfo.password !== userInfo.rePassword) {
                updatePasswordsMatch(false);
            } else {
                updatePasswordsMatch(true);
            }
        }
    }, [isEmailVerified, userInfo.password, userInfo.rePassword]);

    useEffect(() => {
        if (isEmailVerified && userInfo.password) {
            if (userInfo.password?.length >= 6) {
                //todo: add more conditions here
                updateValidPassword(true);
            } else {
                updateValidPassword(false);
            }
        } else {
            updateValidPassword(true);
        }
    }, [isEmailVerified, userInfo.password]);

    if (redirect) {
        return <Navigate to="/" />
    }

    return (
        <>
            <Header />
            <Box
                border={"3px solid grey"}
                borderRadius={"15px"}
                width={"40%"}
                margin={"5% auto"}
                p={"35px 40px"}
            >
                <Grid container spacing={4}>

                    <Grid item xs={12} textAlign={"center"}>
                        <h1>Reset Password</h1>
                    </Grid>

                    {
                        error &&

                        <Grid item xs={12} textAlign={"center"}>
                            <Alert severity="error" fullWidth>
                                {errorMessage}
                            </Alert>
                        </Grid>
                    }

                    <Grid item xs={8}>
                        <TextField
                            required
                            fullWidth
                            type="email"
                            name="email"
                            error={!validEmail}
                            helperText={
                                !validEmail ? "Please Enter a valid Email" : ""
                            }
                            label="Email"
                            value={userInfo.email}
                            onChange={handleChange}
                            disabled={isOtpSentToUser || isEmailVerified}
                        />
                    </Grid>

                    {!isEmailVerified ? (
                        <Grid item xs={4} textAlign={"center"} >
                            <Button
                                fullWidth
                                style={{ textTransform: "none", padding: "14px 0px" }}
                                onClick={handleSendOTP}
                                disabled={
                                    !validEmail ||
                                    userInfo.email?.length === 0 ||
                                    isOtpSentToUser ||
                                    isEmailVerified
                                }
                                variant="contained"
                            >
                                SEND OTP
                            </Button>
                        </Grid>
                    ) : (
                        <Grid item xs={4} textAlign={"center"}>
                            <Alert severity="success">
                                Email Verified
                            </Alert>
                        </Grid>
                    )}

                    {isOtpSentToUser && !isEmailVerified && (
                        <>
                            <Grid item xs={6} textAlign={"left"}>
                                <TextField
                                    required
                                    name="otp"
                                    label="Enter OTP"
                                    value={userInfo.otp}
                                    disabled={
                                        !isOtpSentToUser ||
                                        displayIncorrectOTP ||
                                        isEmailVerified
                                    }
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={6} textAlign={"center"}>
                                <Button
                                    style={{ textTransform: "none", padding: "14px 0px" }}
                                    onClick={handleVerifyEmailButton}
                                    disabled={
                                        displayIncorrectOTP ||
                                        userInfo.otp?.length === 0 ||
                                        isEmailVerified
                                    }
                                    fullWidth
                                    variant="contained"
                                >
                                    Verify Email
                                </Button>
                            </Grid>
                        </>
                    )}

                    {displayIncorrectOTP && (
                        <>
                            <Grid item xs={6} textAlign={"center"}>
                                <Alert severity="error">
                                    Incorrect OTP
                                </Alert>
                            </Grid>

                            <Grid item xs={6} textAlign={"center"}>
                                <Button
                                    fullWidth
                                    onClick={handleSendOTP}
                                    disabled={
                                        !validEmail || userInfo?.length === 0
                                    }
                                    variant="contained"
                                    style={{ textTransform: "none", padding: "14px 0px" }}
                                >
                                    ReSend OTP
                                </Button>
                            </Grid>
                        </>
                    )}

                    {isEmailVerified && (
                        <>
                            <Grid item xs={6} textAlign={"left"}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    error={!validPassword}
                                    label="Enter Password"
                                    value={userInfo.password}
                                    onChange={handleChange}
                                    helperText={
                                        !validPassword
                                            ? "Password must be atleast 6 character"
                                            : ""
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={
                                                        handleClickShowPassword
                                                    }
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} textAlign={"center"}>
                                <TextField
                                    required
                                    fullWidth
                                    name="rePassword"
                                    type={showRePassword ? "text" : "password"}
                                    label="Re-enter Password"
                                    error={!passwordsMatch}
                                    value={userInfo.rePassword}
                                    onChange={handleChange}
                                    helperText={
                                        !passwordsMatch
                                            ? "Passwords don't match"
                                            : ""
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={
                                                        handleClickShowRePassword
                                                    }
                                                    edge="end"
                                                >
                                                    {showRePassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12} textAlign={"center"}>
                        <Button
                            variant="contained"
                            onClick={handleResetPasswordButton}
                            disabled={
                                !isEmailVerified ||
                                !passwordsMatch ||
                                userInfo.password?.length < 6
                            }
                            fullWidth
                            style={{ textTransform: "none", padding: "14px 0px" }}
                        >
                            Reset Password
                        </Button>
                    </Grid>

                    <Grid item xs={6} textAlign={"center"}>
                        <Link to="/login">Already have an account?</Link>{" "}
                    </Grid>

                    <Grid item xs={6} textAlign={"center"}>
                        <Link to="/register">Create an account</Link>{" "}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default ForgotPassword;
