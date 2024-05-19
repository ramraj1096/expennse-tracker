import User from "../models/userSchema.js";

export const createUser = async (request) => {
    const { name, email, mobileNumber, password } = request;
    const result = await User.create({
        name,
        email,
        mobileNumber,
        password
    });
    if (!result) return null;
    return result;
}

export const getOneByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) return null;
    return user;
}

export const getOneByMobileNo = async (mobileNo) => {
    const user = await User.findOne({ mobileNo });
    if (!user) return null;
    return user;
}

export const getUserByEmailAndMobileNo = async (email, mobileNo) => {
    const user = await User.findOne({ email, mobileNo });
    console.log(user);

    const users = await User.find();
    console.log(users);

    if (!user || user.length === 0) return null;
    return user;
}

export const getOnyByEmailAndId = async (email, id) => {
    const user = await User.findOne({ email, id });
    if (!user) return null;
    return user;
}

export const getOnyByMobileNoAndId = async (mobileNo, id) => {
    const user = await User.findOne({ mobileNo, id });
    if (!user) return null;
    return user;
}

export const getAllUser = async () => {
    const users = await User.find();
    if (!users || users.length === 0) return null;
    return users;
}

export const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) return null;
    return user;
}

export const updateUserById = async (id, request) => {
    const updated = await User.updateOne({ _id: id, ...request });
    return updated;
}

export const updateUserByEmail = async (email, request) => {
    const updated = await User.updateOne({ email: email }, request);
    return updated;
}

export const deleteUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) return false;
    await user.deleteOne();
    return true;
}

export const banUser = async (email) => {
    let user = await getOneByEmail(email);
    console.log(user);

    const updates = {
        isBanned: true,
        banTime: new Date()
    };

    console.log(updates);

    const isUpdated = await User.updateOne({ _id: user._id }, updates);
    return isUpdated;
}

export const unbanUser = async (email) => {
    let user = await getOneByEmail(email);
    user.isBanned = false;
    const isUpdated = await User.updateOne({ email: email }, user);
    return isUpdated;
}