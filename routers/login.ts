import { Request, Response, Router } from "express";
import * as bcrypt from "bcrypt";
import UserRecord from "../record/user.record";
const jwt = require("jsonwebtoken");

export const loginRouter = Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await UserRecord.getOne(email);
    if (!userData) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const passwordValidation = await bcrypt.compare(
      password,
      userData.password
    );
    if (!passwordValidation) {
      return res.status(401).json({ message: "Invalid password" });
    }
    if (passwordValidation && process.env.SECRET_KEY) {
      const accessToken = jwt.sign(
        { mail: userData.email },
        process.env.SECRET_KEY
      );
      res.json({ accessToken: accessToken });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
