import { Request, Response, Router } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UserService } from "../services/UserService";

export const loginRouter = Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.getOne(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (process.env.SECRET_KEY) {
      const accessToken = jwt.sign({ mail: user.email }, process.env.SECRET_KEY);
      res.json({ accessToken });
    } else {
      res.status(500).json({ message: "Server error: Missing SECRET_KEY" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
