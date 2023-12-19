import { Request, Response, Router } from "express";
import * as bcrypt from "bcrypt";
import UserRecord from "../record/user.record";
import { UserEntity } from "../types/user.entity";

export const registerRouter = Router();

registerRouter
  // .get('/',  async(req: Request, res:Response) => {
  //     res.send('abcde')
  // })
  .post("/", async (req: Request, res: Response) => {
    try {
      const newUser: UserEntity = req.body;
      console.log(req.body, "co przyszło z frontu", "obj new user:", newUser);

      if (!newUser.name || !newUser.email || !newUser.password) {
        console.log(
          "nie ma pws",
          newUser.password,
          "albo name",
          newUser.name,
          "albo email",
          newUser.email
        );
        return res.sendStatus(400);
      }

      const salt = bcrypt.genSaltSync(10);
      newUser.password = bcrypt.hashSync(newUser.password, salt);
      console.log("hashowanie hasła", newUser.password);
      const completedUser = { ...newUser, isAdmin: 0 };
      const user = new UserRecord(completedUser);
      await UserRecord.insert(completedUser);
      console.log("po wstawieniu do bazy");
      // if(process.env.SECRET_KEY){
      //     res.cookie('token', jsontoken, { httpOnly: true, secure: true , expires: new Date(Number(new Date()) + 30*60*1000) });
      //     console.log('token cookie')

      //     res.json({token: jsontoken});
      // }

      //return res.redirect('/mainpage');
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  });
