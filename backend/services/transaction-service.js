import Transaction from "../models/transactionSchema.js";

export const createTransaction = async (request) => {
    const { title, amount, category, description, transactionType, date, user } = request;
    const transaction = await Transaction.create({
        title,
        amount,
        category,
        description,
        transactionType,
        date,
        user
    });
    if (!transaction) return null;
    return transaction;
}

export const getAllTransactionByUserId = async (userId) => {
    const transactions = await Transaction.find({ user: userId });
    if (!transactions) return [];
    return transactions;
}

export const getAllTransaction = async (query) => {
    console.log(query);
    const transactions = await Transaction.find(query);
    if (!transactions) return [];
    return transactions;
}

export const getTransactionById = async (id) => {
    const transaction = await Transaction.findById(id);
    if (!transaction) return null;
    return transaction;
}

export const updateTransactionById = async (id, request) => {
    const updated = await Transaction.updateOne({_id: id}, request);
    return updated;
}

export const deleteTransactionById = async (id) => {
    const result = await Transaction.deleteOne({_id : id});
    return result;
}