import * as transactionService from "../services/transaction-service.js";
import * as userService from "../services/user-service.js";
import moment from "moment";

export const create = async (request, response) => {
    try {
        const {
            title,
            amount,
            category,
            description,
            transactionType,
            date,
            userId,
        } = request.body;

        if (
            !title ||
            !amount ||
            !category ||
            !description ||
            !transactionType ||
            !date
        ) {
            return response.status(400).json({
                success: false,
                message: "Please fill all the fields!",
            });
        }

        const user = await userService.getUserById(userId);

        if (!user) {
            return response.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        let newTransaction = await transactionService.createTransaction({
            title: title,
            amount: amount,
            category: category,
            description: description,
            transactionType: transactionType,
            date: date,
            user: userId,
        });

        user.transactions.push(newTransaction);
        user.save();

        return response.status(200).json({
            success: true,
            message: "Transaction added successfully!",
        });
    } catch (err) {
        return response.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getAllTransactionByUserId = async (request, response) => {
    try {
        const { userId } = request.body;
        const user = await userService.getUserById(userId);

        if (!user) {
            return response.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const transactions = await transactionService.getAllTransactionByUserId(
            userId
        );

        return response.status(200).json({
            success: true,
            transactions: transactions,
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getAllTransactions = async (request, response) => {
    try {
        const { userId, transactionType, frequency, startDate, endDate } =
            request.body;

        const user = await userService.getUserById(userId);

        if (!user) {
            return response.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        let query = {
            user: userId,
        };

        if (transactionType !== "all") {
            query.transactionType = transactionType;
        }

        if (frequency !== "custom") {
            query.date = {
                $gt: moment().subtract(Number(frequency), "days").toDate(),
            };
        } else if (startDate && endDate) {
            query.date = {
                $gte: moment(startDate).toDate(),
                $lte: moment(endDate).toDate(),
            };
        }

        const transactions = await transactionService.getAllTransaction(query);

        return response.status(200).json({
            success: true,
            transactions: transactions,
        });
    } catch (err) {
        response.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const updateTransaction = async (request, response) => {
    try {
        const transactionId = request.params.id;

        const { title, amount, category, description, transactionType, date } =
            request.body;

        const transactionElement = await transactionService.getTransactionById(
            transactionId
        );

        if (!transactionElement) {
            return response.status(400).json({
                success: false,
                message: "Transaction not found!",
            });
        }

        const data = {
            title: title,
            amount: amount,
            category: category,
            description: description,
            transactionType: transactionType,
            date: date,
        };

        const updated = await transactionService.updateTransactionById(
            transactionId,
            data
        );

        if (!updated) {
            return response.status(400).json({
                success: false,
                message: "some error occured",
            });
        }

        const transaction = await transactionService.getTransactionById(
            transactionId
        );

        return response.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            transaction: transaction,
        });
    } catch (err) {
        return response.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const deleteTransaction = async (request, response) => {
    try {
        const { transactionId, userId } = request.params;

        const user = await userService.getUserById(userId);

        if (!user) {
            return response.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const transactionDeleted =
            await transactionService.deleteTransactionById(transactionId);

        if (!transactionDeleted) {
            return response.status(400).json({
                success: false,
                message: "Transaction not found",
            });
        }

        const transactionsAfterDeletion = user.transactions.filter(
            (transaction) => {
                return transaction._id === transactionId;
            }
        );

        user.transactions = transactionsAfterDeletion;
        user.save();

        return response.status(200).json({
            success: true,
            message: "Transaction deleted successfully!",
        });
    } catch (err) {
        return response.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
