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
exports.getAllAccounts = exports.createAccount = void 0;
const __1 = require("..");
const lodash_1 = require("lodash");
const generateAccount_1 = require("../utils/generateAccount");
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, lodash_1.toInteger)(req.user.userId);
        const { type } = req.body;
        if (!type)
            return res
                .status(400)
                .json({ msg: "Incomplete information to open account" });
        const account = yield __1.client.account.create({
            data: {
                ownerid: id,
                acnumber: (0, generateAccount_1.generateAC)(),
                type: type,
            },
        });
        if (account) {
            return res
                .status(200)
                .json({ msg: "Account opened successfully", success: true, account });
        }
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ msg: "Internal server error", success: false });
    }
});
exports.createAccount = createAccount;
const getAllAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, lodash_1.toInteger)(req.user.userId);
        const accounts = yield __1.client.account.findMany({
            where: {
                ownerid: id,
            },
        });
        return res.status(200).json({ msg: "Accounts fetched", accounts });
    }
    catch (error) {
        return res
            .status(500)
            .json({ msg: "Internal server error", success: false });
    }
});
exports.getAllAccounts = getAllAccounts;
