import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { connectDB } from "./DB/Database.js";
import userRouter from "./router/user-router.js";
import otpRouter from "./router/otp-router.js";
import tranactionRouter from "./router/transaction-router.js";

dotenv.config({ path: "./config/config.env" });
const app = express();
const port = process.env.PORT;

connectDB();

const allowedOrigins = [
    "https://wallet-watch-01.vercel.app",
    "https://wallet-watch-sable.vercel.app/",
    "https://wallet-watch-harshbardolia01.vercel.app/",
    // add more origins as needed
];

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (request, response) => {
    response.send("Hello World!");
})

app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);
app.use("/api/transaction", tranactionRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})
