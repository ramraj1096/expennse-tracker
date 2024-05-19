import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: validator.isEmail,
    },

    mobileNumber: {
        type: String,
        // required: [true, "Mobile number required"],
        // unique: true,
        length: [10, "Mobile number must be of 10 digits"],
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password Must Be Atleast 6 characters"],
    },

    transactions: {
        type: [],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    isBanned: {
        type: Boolean,
        default: false
    },

    banTime: {
        type: Date,
    },
});

const User = mongoose.model("User", userSchema);
export default User;