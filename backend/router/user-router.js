import {Router} from "express";
import * as controller from "../controller/user-controller.js";

const router = Router();

router.post(
    "/register",
    controller.register
);

router.post(
    "/login",
    controller.login
);

router.post(
    "/resetPassword",
    controller.resetPassword
);

export default router;