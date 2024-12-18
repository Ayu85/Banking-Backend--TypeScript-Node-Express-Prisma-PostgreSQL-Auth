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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve token from cookies
        const token = req.cookies.token;
        if (!token)
            return res.status(400).json({ msg: "No Token Provided", success: false });
        // Ensure JWT_SECRET exists in environment variables
        const secret = process.env.JWT_SECRET;
        if (!secret)
            return res.status(400).json({ msg: "Missing JWT_SECRET in environment" });
        // Verify and decode the token
        //@ts-ignore
        const decoded = jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ msg: "Invalid or Expired Token", success: false });
            }
            // Attach the decoded user information to the request object
            req.user = decoded; // Store decoded data (like userId) in req.user
            next(); // Proceed to the next middleware/handler
        });
    }
    catch (error) {
        return res.status(500).json({ msg: "Internal Server Error", success: false });
    }
});
exports.isAuth = isAuth;
