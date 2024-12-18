"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountControllers_1 = require("../controllers/accountControllers");
const isAuth_1 = require("../middlewares/isAuth");
const accountRoutes = (0, express_1.Router)();
// Explicitly typed route handler
accountRoutes.post("/create", (req, res, next) => {
    (0, isAuth_1.isAuth)(req, res, next);
}, (req, res, next) => {
    (0, accountControllers_1.createAccount)(req, res);
});
accountRoutes.get("/getaccounts", (req, res, next) => {
    (0, isAuth_1.isAuth)(req, res, next);
}, (req, res, next) => {
    (0, accountControllers_1.getAllAccounts)(req, res);
});
exports.default = accountRoutes;
