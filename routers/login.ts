import { Request, Response, Router } from "express";
import * as bcrypt from 'bcrypt';
import UserRecord from '../record/user.record'
import * as jsonwebtoken from "jsonwebtoken"

export const loginRouter = Router();

loginRouter
    .post('/', async(req: Request, res:Response) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const userData = await UserRecord.getOne(email)
        
        
              if (!userData) {
                return res.sendStatus(400);
             }
            const user = new UserRecord(userData)
            console.log('proba logowania', 'email:', email, 'password', password, 'user:', user)
             const passwordValidation = await bcrypt.compare(password, user.password);

            
             console.log('wyzej sie blokuje')
             if(passwordValidation && process.env.SECRET_KEY){
                const jsontoken = jsonwebtoken.sign({email: user.email, isAdmin: user.isAdmin}, process.env.SECRET_KEY, { expiresIn: '30m'} );
                res.cookie('token', jsontoken, { httpOnly: true, secure: true, expires: new Date(Number(new Date()) + 30*60*1000) });
         
                res.json({token: jsontoken});
               //return res.redirect('/mainpage') ;
         
            }  else{
                return res.json({
                    message: "Invalid email or password"
                });
            } 
         
            } catch(e){
                console.log(e);
            }
})

