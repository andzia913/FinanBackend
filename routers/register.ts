import { Request, Response, Router } from "express";
import * as bcrypt from 'bcrypt';
import UserRecord from '../record/user.record'
import * as jsonwebtoken from "jsonwebtoken"
import { UserEntity } from "../types/user.entity";

export const registerRouter = Router();

registerRouter
    // .get('/',  async(req: Request, res:Response) => {
    //     res.send('abcde')
    // })
    .post('/', async(req: Request, res:Response) => {
    try{
        const newUser: UserEntity = req.body
        console.log(req.body, 'co przyszło z frontu', 'obj new user:', newUser)


              if (!newUser.name || !newUser.email || !newUser.password) {
                console.log('nie ma pws', newUser.password, 'albo name', newUser.name, 'albo email', newUser.email)
                return res.sendStatus(400);
             }
            //  bcrypt.genSalt(10, async (err, salt) => {
            //     if (err) {
            //         console.error('Błąd podczas generowania soli:', err);
            //         return res.sendStatus(500);
            //     }
    
            //     // Hash the password
            //     bcrypt.hash(newUser.password, salt, async (err, hashedPassword) => {
            //         if (err) {
            //             console.error('Błąd podczas hashowania hasła:', err);
            //             return res.sendStatus(500);
            //         }
            //         newUser.password = hashedPassword;
            //         // Utwórz obiekt użytkownika z hashowanym hasłem
            //         // const newUser = {
            //         //     name: user,
            //         //     email,
            //         //     password: hashedPassword,
            //         // };
    
            //         // Wstaw użytkownika do bazy danych
            //         // const userRecord = new UserRecord(newUser);
            //         // await UserRecord.insert(userRecord);
    
            //         // // Generuj token JWT
            //         // const jsontoken = jsonwebtoken.sign({ user: userRecord }, process.env.SECRET_KEY ?? '', { expiresIn: '30m' });
    
            //         // // Ustaw cookie z tokenem
            //         // res.cookie('token', jsontoken, { httpOnly: true, secure: true, expires: new Date(Number(new Date()) + 30 * 60 * 1000) });
    
            //         // // Odpowiedz z tokenem
            //         // res.json({ token: jsontoken });
            //     });
            // });
             const salt = bcrypt.genSaltSync(10)
             newUser.password = bcrypt.hashSync(newUser.password, salt);
             console.log('hashowanie hasła', newUser.password)
             const completedUser = {...newUser, isAdmin: 0}
             const user = new UserRecord(completedUser);
             await UserRecord.insert(completedUser);
             console.log('po wstawieniu do bazy')
        if(process.env.SECRET_KEY){
            const jsontoken = jsonwebtoken.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );
            res.cookie('token', jsontoken, { httpOnly: true, secure: true , expires: new Date(Number(new Date()) + 30*60*1000) });
            console.log('token cookie')
     
            res.json({token: jsontoken});
        }                      

 
            //return res.redirect('/mainpage');
  
    } catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
})

