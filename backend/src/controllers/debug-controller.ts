import { Request, Response } from "express";
import { getClientIp } from "../middlewares/ipMiddleware";

export const getIpInfo = (req: Request, res: Response) => {
    const ip = getClientIp(req);
    
    res.json({
        ip: ip,
        headers: {
            'x-forwarded-for': req.headers['x-forwarded-for'],
            'x-real-ip': req.headers['x-real-ip'],
        }
    });
};