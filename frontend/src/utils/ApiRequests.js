const baseUrl = "https://wallet-watch.onrender.com";

export const sendOtpApi = `${baseUrl}/api/otp/sendOTP`;
export const verifyOtpApi = `${baseUrl}/api/otp/verifyOTP`;
export const registerApi = `${baseUrl}/api/user/register`;
export const loginApi = `${baseUrl}/api/user/login`;
export const createTransactionApi = `${baseUrl}/api/transaction/create`;
export const getTransactionsApi = `${baseUrl}/api/transaction/getAllTransaction`;
export const updateTransactionApi = `${baseUrl}/api/transaction/updateById`;
export const deleteTransactionApi = `${baseUrl}/api/transaction/deleteById`;
export const getAllTransactionByUserIdApi = `${baseUrl}/api/transaction/getAllTransactionByUserId`;
export const resetPasswordApi = `${baseUrl}/api/user/resetPassword`;
