import type { NextFunction, Request, Response } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers['authorization']

    req.userId = "1";  //tryiing to hardcode for now
    next();
}