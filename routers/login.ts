import { Request, Response, Router } from "express";
import * as bcrypt from 'bcrypt';
import UserRecord from '../record/user.record';
import * as jsonwebtoken from "jsonwebtoken";
const passport = require('passport');
const jwt = require('jsonwebtoken');
export const loginRouter = Router();
import { localStrategy } from "../utils/passportStrategy";

loginRouter
    .post('/',
     passport.authenticate('local', {failureMessage: true, failWithError: true} ), 
     async(req: Request, res:Response) => {
        console.log('zapytanie przeszło na /login', req)
//     try{
//         const email = req.body.email;
//         const password = req.body.password;
//         const userData = await UserRecord.getOne(email)
    
//               if (!userData) {
//                 return res.status(400).json({ message: "Invalid email or password" });;
//              }
//             const user = new UserRecord(userData)
//             console.log('proba logowania', 'email:', email, 'password', password, 'user:', user)
//              const passwordValidation = await bcrypt.compare(password, user.password);

//              console.log('po walidacji hasła')
//              if(passwordValidation && process.env.SECRET_KEY){
//                 const jsontoken = jsonwebtoken.sign({email: user.email, isAdmin: user.isAdmin}, process.env.SECRET_KEY, { expiresIn: '30m'} );
//                 res.cookie('token', jsontoken, { httpOnly: true, secure: true, expires: new Date(Number(new Date()) + 30*60*1000) });
                
//                 res.json({token: jsontoken});
//                //return res.redirect('/mainpage') ;
//                 console.log('token przesłany w odpowiedzi na poprawne logowanie', jsontoken)
//             }  else{
//                 return res.json({
//                     message: "Invalid email or password"
//                 });
//             } 
         
//             } catch(e){
//                 console.log(e);
//                 res.status(500).json({ message: "Internal Server Error" });
//             }
// })
     })
    .delete('/', passport.authenticate('local'), (req: Request, res: Response) => {
        // Jeśli autentykacja przebiegła pomyślnie
        res.json({ success: true, user: req.user });
      });

