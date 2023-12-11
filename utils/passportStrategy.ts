import UserRecord from "../record/user.record";
import * as bcrypt from 'bcrypt';
// import passport from 'passport';
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
import * as dotenv from 'dotenv';

dotenv.config();


const localStrategy = async (email: string, password: string, done: Function) => {
  console.log('wszedł do lokalnej strategi')
  try {
    const user = await UserRecord.getOne(email);
    if (!user) {
      return done(null, false, { message: 'Invalid username' });
    }
    const passwordValidation = await bcrypt.compare(password, user.password);
    if (!passwordValidation) {
      return done(null, false, { message: 'Invalid password' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};
// const jwtOptions = {
//   jwtFromRequest: (req) => {
//     const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
//     return token;
//   },
//   secretOrKey: process.env.SECRET_KEY,
// };

// const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
//   // if(!jwtOptions.secretOrKey){
//   //   return console.error('Nie ma secretu')
//   // }
//   try {
//     const user = await UserRecord.getOne(payload.email);
//     if (user) {
//       done(null, user);
//     } else {
//       done(null, false, { message: 'Nieprawidłowy token JWT - użytkownik nie istnieje.' });
//     }
//   } catch (error) {
//     done(error, false, { message: 'Błąd weryfikacji tokena JWT.' });
//   }
// });


export { localStrategy };