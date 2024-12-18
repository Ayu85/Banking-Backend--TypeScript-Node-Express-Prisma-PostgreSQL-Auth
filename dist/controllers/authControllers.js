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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signUp = void 0;
const __1 = require("..");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, password, contact, email } = req.body;
        if (!fullname || !password || !contact || !email)
            return res.status(400).json({ msg: "Missing fields", success: false });
        const doesCustomerExists = yield __1.client.customer.findFirst({
            where: {
                email: email,
            },
        });
        if (doesCustomerExists)
            return res
                .status(400)
                .json({ msg: "User already exists", success: false });
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        const newCustomer = yield __1.client.customer.create({
            data: {
                fullname,
                password: passwordHash,
                contact,
                email,
            },
        });
        if (newCustomer) {
            const { password } = newCustomer, customerWithoutPassword = __rest(newCustomer, ["password"]);
            return res.status(200).json({
                msg: "User created successfully",
                success: true,
                customer: customerWithoutPassword,
            });
        }
        return res.status(500).json({ msg: "Unexpected error occurred" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ msg: "Missing fields", success: false });
        const user = yield __1.client.customer.findFirst({
            where: {
                email: email,
            },
        });
        // console.log(user);
        if (!user)
            return res.status(404).json({ msg: "User not found", success: false });
        const matchPassword = yield bcrypt_1.default.compare(password, user.password);
        if (matchPassword) {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                return res.status(500).json({
                    msg: "JWT Secret is not configured",
                    success: false,
                });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.custid }, secret, { expiresIn: "1h" });
            const { password } = user, customerWithoutPassword = __rest(user, ["password"]);
            return res.cookie("token", token, { httpOnly: true }).status(200).json({
                msg: "Login successs",
                success: true,
                user: customerWithoutPassword,
            });
        }
        return res.status(404).json({ msg: "Invalid Password", success: false });
    }
    catch (error) {
        return res
            .status(200)
            .json({ msg: "Internal Server Error", success: false });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.cookie("token", "").status(200).json("Logged out successfully");
    }
    catch (error) {
        return res
            .status(200)
            .json({ msg: "Internal Server Error", success: false });
    }
});
exports.logout = logout;
