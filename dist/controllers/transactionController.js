"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTransactions = exports.sendMoney = void 0;
const lodash_1 = require("lodash");
const __1 = require("..");
const sendMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, description, toAccountId, fromAccountId } = req.body;
        const to = (0, lodash_1.toInteger)(toAccountId);
        const fromAccountInt = (0, lodash_1.toInteger)(req.user.userID);
        const fromAccountIdStr = (0, lodash_1.toString)(req.user.userId);
        if (!amount || !toAccountId)
            return res.status(400).json({ msg: "Missing fields", success: false });
        // Validate if the 'amount' is positive
        if (amount <= 0) {
            return res.status(400).json({ msg: "Invalid amount", success: false });
        }
        // Check if both accounts exist
        const fromAccount = yield __1.client.account.findFirst({
            where: { acnumber: fromAccountId },
        });
        const toAccount = yield __1.client.account.findFirst({
            where: { acnumber: toAccountId },
        });
        // console.log(toAccount);
        if (!fromAccount || !toAccountId) {
            return res.status(400).json("One or both accounts do not exist");
        }
        // Ensure that the from account has sufficient balance
        if (fromAccount.balance < amount) {
            return res.status(400).json("Insufficient funds");
        }
        // Start transaction
        const result = yield __1.client.$transaction((client) => __awaiter(void 0, void 0, void 0, function* () {
            // Debit from the sender account
            yield client.account.update({
                where: { acnumber: fromAccountId },
                data: { balance: fromAccount.balance - amount },
            });
            // Credit to the recipient account
            yield client.account.update({
                where: { acnumber: toAccountId },
                data: { balance: (toAccount === null || toAccount === void 0 ? void 0 : toAccount.balance) + amount },
            });
            // Optionally, record the transaction in a transaction history table
            const transaction = yield client.transaction.create({
                data: {
                    amount,
                    description,
                    fromAccountId: fromAccountId,
                    toAccountId: toAccountId,
                },
            });
            return res.status(200).json({
                msg: "Transaction successful!!",
                success: true,
                data: transaction,
            });
        }));
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ msg: "Internal Server Error", success: false });
    }
});
exports.sendMoney = sendMoney;
const fetchTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fromAccountId } = req.body;
        const userID = (0, lodash_1.toInteger)(req.user.userId);
        const checkOwner = yield __1.client.account.findFirst({
            where: { ownerid: userID },
        });
        if ((checkOwner === null || checkOwner === void 0 ? void 0 : checkOwner.acnumber) !== fromAccountId)
            return res.status(400).json({ msg: "Unable to fetch", success: false });
        // Fetch transactions and include the owner's name of the receiving account (toAccountId)
        const transactions = yield __1.client.transaction.findMany({
            where: { fromAccountId: fromAccountId },
            include: {
                toAccount: {
                    select: {
                        owner: {
                            select: {
                                fullname: true, // Assuming the 'Customer' model has a 'fullname' field
                            },
                        },
                    },
                },
            },
        });
        // Check if transactions were found
        if (transactions.length > 0) {
            return res.status(200).json({
                msg: "Transactions Fetched Successfully",
                success: true,
                transactions: transactions.map((transaction) => {
                    var _a, _b;
                    return (Object.assign(Object.assign({}, transaction), { toAccountOwnerName: (_b = (_a = transaction.toAccount) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.fullname }));
                }),
            });
        }
        else {
            return res.status(404).json({
                msg: "No Transactions Found",
                success: false,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ msg: "Internal Server Error", success: false });
    }
});
exports.fetchTransactions = fetchTransactions;
