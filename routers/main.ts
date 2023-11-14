import { Request, Response, Router } from "express";

export const mainRouter = Router();

mainRouter.get('/', async(req: Request, res:Response) => {
    res.send('main')
})