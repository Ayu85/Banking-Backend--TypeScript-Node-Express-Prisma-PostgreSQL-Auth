"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuth_1 = require("../middlewares/isAuth");
const cardControllers_1 = require("../controllers/cardControllers");
const router = (0, express_1.Router)();
router.post("/apply", (req, res, next) => {
    (0, isAuth_1.isAuth)(req, res, next);
}, (req, res) => {
    (0, cardControllers_1.applyForCard)(req, res);
});
exports.default = router;
