"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuth_1 = require("../middlewares/isAuth");
const transactionController_1 = require("../controllers/transactionController");
const router = (0, express_1.Router)();
router.post("/send", (req, res, next) => {
    (0, isAuth_1.isAuth)(req, res, next);
}, (req, res, next) => {
    (0, transactionController_1.sendMoney)(req, res);
});
router.get("/fetch-transactions", (req, res, next) => {
    (0, isAuth_1.isAuth)(req, res, next);
}, (req, res) => {
    (0, transactionController_1.fetchTransactions)(req, res);
});
exports.default = router;
