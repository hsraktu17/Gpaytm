import { Request, Response, NextFunction } from "express";
import JWT_SECRET from "./routes/config";
import jwt from 'jsonwebtoken';

interface DecodedToken {
    userId: string; // Adjust the type if needed
}

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        if(decoded.userId){
            req.userId = decoded.userId; 
            next();
        }
        else{
            res.status(403).json({})
        }
        
    } catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(403).json({ message: "Failed to authenticate token" });
    }
}

export default authMiddleware;
