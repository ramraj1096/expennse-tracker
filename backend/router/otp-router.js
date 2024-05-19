import { Router } from "express";
import * as controller from "../controller/otp-controller.js";

const router = Router();

router.post(
    "/sendOTP",
    controller.sendOTP
);

router.post(
    "/verifyOTP",
    controller.verifyOTP
);

export default router;