import { Request, Response, Router } from "express";
import * as bcrypt from "bcrypt";
import { UserService } from "../services/UserService";
import { User } from "../entities/User";

export const registerRouter = Router();

registerRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const existingUser = await UserService.getOne(email);
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.isAdmin = false;

    await UserService.insert(newUser);

    res.status(201).json({ message: "User successfully registered" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
