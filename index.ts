import * as express from 'express';
import 'express-async-errors';
import * as cors from 'cors';
import { mainRouter } from "./routers/main";
import { costStructureRouter } from "./routers/costStructure";
import { financialBalanceRouter } from "./routers/financialBalance";
import { cashFlowRouter } from "./routers/cashFlow";
import { financialGoalsRouter } from "./routers/cashGoals";
import * as cookieParser from 'cookie-parser';
import { loginRouter } from './routers/login';
import { registerRouter } from './routers/register';
const session= require('express-session');
const passport = require('passport');
import * as dotenv from 'dotenv';
import { localStrategy} from './utils/passportStrategy';
import { logoutRouter } from './routers/logout';
// import JwtStrategy, {ExtractJwt} from 'passport-jwt';
// const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy


dotenv.config();
const app = express();

app.use(cors({
  origin: "http://127.0.0.1:5173",
  credentials: true,
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}))



if (process.env.SECRET_KEY) {
  console.log('widzi klucz')
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
}
passport.use(new LocalStrategy({usernameField:"email", passwordField:"password"},localStrategy))
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      mail: user.username,
    });
  });
});
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
}); 

// passport.use(localStrategy);//..............................................



app.use('/', mainRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);


// passport.use(jwtStrategy);

app.use('/logout', logoutRouter);
app.use('/costStructure', costStructureRouter);
app.use('/financialBalance', financialBalanceRouter);
app.use('/cashFlow', cashFlowRouter);
app.use('/financialGoals', financialGoalsRouter);

app.listen(5000, '0.0.0.0', () => {
  console.log('Listening on http://localhost:5000');
});
