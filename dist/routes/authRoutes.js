"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const isAuth_1 = require("../middlewares/isAuth");
const router = (0, express_1.Router)();
// Explicitly typed route handler
router.post('/signup', (req, res, next) => {
    (0, authControllers_1.signUp)(req, res);
});
router.post('/login', (req, res, next) => {
    (0, authControllers_1.login)(req, res);
});
router.post('/logout', (req, res, next) => {
    (0, authControllers_1.logout)(req, res);
});
router.get('/checkauth', (req, res, next) => {
    (0, isAuth_1.isAuth)(req, res, next);
}, (req, res) => {
    (0, authControllers_1.checkAuth)(req, res);
});
exports.default = router;
