import { Request, Response, Router } from "express";
import * as bcrypt from "bcrypt";
import UserRecord from "../record/user.record";
import { UserEntity } from "../types/user.entity";

export const registerRouter = Router();

registerRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newUser: UserEntity = req.body;
    if (!newUser.name || !newUser.email || !newUser.password) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const isUserArledyExist = await UserRecord.getOne(newUser.email);
    if (isUserArledyExist) {
      res.status(409).json({ message: "User with this email already exists." });
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    newUser.password = bcrypt.hashSync(newUser.password, salt);
    const completedUser = { ...newUser, isAdmin: 0 };
    await UserRecord.insert(completedUser);
    res.status(201).json({ message: "User successfully registered" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
