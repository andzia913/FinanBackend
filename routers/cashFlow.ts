import { Request, Response, Router } from "express";

export const cashFlowRouter = Router();

cashFlowRouter
    .get('/', async(req: Request, res:Response) => {
    res.send('cashflow')
})