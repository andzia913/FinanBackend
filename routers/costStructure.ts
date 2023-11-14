import { Request, Response, Router } from "express";

export const costStructureRouter = Router();

costStructureRouter.get('/', async(req: Request, res:Response) => {
    res.send('costStructure')
})