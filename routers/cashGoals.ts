import { Request, Response, Router } from "express";

export const financialGoalsRouter = Router();

financialGoalsRouter.get('/', async(req: Request, res:Response) => {
    res.send('financialGoals')
})