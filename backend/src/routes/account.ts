import express, { Request, Response } from 'express';
import authMiddleware from '../middleware';
import { Account, AccountDocument } from '../db';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/balance', authMiddleware, async (req: Request, res: Response) => {
    try {
        const account: AccountDocument | null = await Account.findOne({
            userId: req.userId
        });

        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }

        res.json({
            balance: account.balance
        });
    } catch (error) {
        console.error("Error fetching account balance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/transfer', authMiddleware, async (req: Request, res: Response) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { amount, to } = req.body;

        const account: AccountDocument | null = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Transaction terminated due to insufficient balance"
            });
        }

        const toAccount: AccountDocument | null = await Account.findOne({
            userId: to
        }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        console.error("Error transferring funds:", error);
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;
