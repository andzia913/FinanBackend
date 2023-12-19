import { Request, Response, Router, request } from "express";
import * as bcrypt from "bcrypt";
import UserRecord from "../record/user.record";
export const loginRouter = Router();

declare module "express-session" {
  interface SessionData {
    userEmail: string;
  }
}
loginRouter
  .get("/", (req: Request, res: Response) => {
    console.log(req.body, req.headers);

    if (req.session.userEmail) {
      res.send({ loggedIn: true, user: req.session.userEmail });
    } else {
      res.send({ loggedIn: false });
    }
  })
  .post("/", async (req: Request, res: Response) => {
    console.log(req.body, req.headers);
    try {
      const email = req.body.email;
      const password = req.body.password;
      const userData = await UserRecord.getOne(email);

      if (!userData) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const user = new UserRecord(userData);

      const passwordValidation = await bcrypt.compare(password, user.password);
      console.log(res.header);

      console.log("po walidacji hasła");
      if (passwordValidation && process.env.SECRET_KEY) {
        req.session.userEmail = req.body.email;
        req.session.save(function (err) {
          if (err) return res.status(500).json({ message: err });
        });
        console.log(req.session.userEmail);
        res.json(user.email);
      } else {
        return res.json({
          message: "Invalid email or password",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
