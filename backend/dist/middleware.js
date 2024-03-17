"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./routes/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Missing or invalid authorization header" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default);
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
        else {
            res.status(403).json({});
        }
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(403).json({ message: "Failed to authenticate token" });
    }
};
exports.default = authMiddleware;
