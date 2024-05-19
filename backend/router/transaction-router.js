import { Router } from "express";
import * as controller from "../controller/transaction-controller.js";

const router = Router();

router.post("/create", controller.create);

router.post("/getAllTransaction", controller.getAllTransactions);

router.post("/getAllTransactionByUserId", controller.getAllTransactionByUserId);

router.put("/updateById/:id", controller.updateTransaction);

router.delete(
    "/deleteById/:transactionId/:userId",
    controller.deleteTransaction
);

export default router;
