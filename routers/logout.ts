import { Router } from "express";


export const logoutRouter = Router();

logoutRouter.post('/', (req, res) => {
    res.clearCookie('token'); 
    res.status(200).json({ success: true });
  });