import * as express from 'express';
import 'express-async-errors';
import * as cors from 'cors'
import {mainRouter} from "./routers/main";
import {costStructureRouter} from "./routers/costStructure";
import {financialBalanceRouter} from "./routers/financialBalance";
import {cashFlowRouter} from "./routers/cashFlow";
import {financialGoalsRouter} from "./routers/cashGoals";
import * as cookieParser from 'cookie-parser';
import { loginRouter } from './routers/login';
import { registerRouter } from './routers/register';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
}))
app.use(cookieParser());

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Zmień na swoją domenę frontendową
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/', mainRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/costStructure', costStructureRouter);
app.use('/financialBalance', financialBalanceRouter);
app.use('/cashFlow', cashFlowRouter);
app.use('/financialGoals', financialGoalsRouter)

app.listen(5000, '0.0.0.0', () => {
    console.log('Listening on http://localhost:5000');
});
