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
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../middleware"));
const db_1 = require("../db");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
router.get('/balance', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield db_1.Account.findOne({
            userId: req.userId
        });
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.json({
            balance: account.balance
        });
    }
    catch (error) {
        console.error("Error fetching account balance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post('/transfer', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let session;
    try {
        session = yield mongoose_1.default.startSession();
        session.startTransaction();
        const { amount, to } = req.body;
        const account = yield db_1.Account.findOne({
            userId: req.userId
        }).session(session);
        if (!account || account.balance < amount) {
            yield session.abortTransaction();
            return res.status(400).json({
                message: "Transaction terminated due to insufficient balance"
            });
        }
        const toAccount = yield db_1.Account.findOne({
            userId: to
        }).session(session);
        if (!toAccount) {
            yield session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }
        yield db_1.Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        yield db_1.Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
        yield session.commitTransaction();
        session.endSession();
        res.json({
            message: "Transfer successful"
        });
    }
    catch (error) {
        console.error("Error transferring funds:", error);
        if (session) {
            yield session.abortTransaction();
            session.endSession();
        }
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
