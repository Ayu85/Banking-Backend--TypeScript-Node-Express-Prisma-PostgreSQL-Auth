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
exports.applyForCard = void 0;
const lodash_1 = require("lodash");
const __1 = require("..");
const cardUtils_1 = require("../utils/cardUtils");
const applyForCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, lodash_1.toInteger)(req.user.userId);
        console.log(req.user);
        console.log(userId, typeof (userId));
        const { account, type } = req.body;
        if (!account || !type)
            return res.status(400).json({ msg: "Missing fields", success: false });
        const checkAccount = yield __1.client.account.findFirst({
            where: {
                acnumber: account,
            },
        });
        if (!checkAccount)
            return res.status(400).json({ msg: "Account not exists!", success: false });
        const card = yield __1.client.card.create({
            data: {
                cardNumber: (0, cardUtils_1.generateCardNumber)(),
                ownerid: userId,
                cvv: (0, cardUtils_1.generateCVV)(),
                expiration: (0, cardUtils_1.generateDateThreeYearsLater)(),
                type: type,
                accountId: account,
            },
        });
        if (card)
            return res
                .status(200)
                .json({ msg: "Applied for card successfully", card });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ msg: "Internal Server Error", success: false });
    }
});
exports.applyForCard = applyForCard;
