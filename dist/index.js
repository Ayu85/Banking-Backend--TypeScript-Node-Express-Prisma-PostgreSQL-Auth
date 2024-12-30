"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const client_1 = require("@prisma/client");
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const cardRoutes_1 = __importDefault(require("./routes/cardRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const logFilePath = path_1.default.join(__dirname, "logs", "app.log");
exports.client = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    const log = `{url:${req.url},type:${req.method},timestamp:${new Date().toLocaleTimeString()}}`;
    // Append the log entry to the file
    fs_1.default.appendFile(logFilePath, log, (err) => {
        if (err) {
            console.error("Error writing to log file:", err);
        }
    });
    next();
});
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/acc", accountRoutes_1.default);
app.use("/api/v1/transaction", transactionRoutes_1.default);
app.use("/api/v1/card", cardRoutes_1.default);
app.listen(process.env.PORT, () => {
    console.log("App running on port ", process.env.PORT);
});
