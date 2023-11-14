import * as express from 'express';
import 'express-async-errors';
import * as cors from 'cors'
import {mainRouter} from "./routers/main";
import {costStructureRouter} from "./routers/costStructure";
import {financialBalanceRouter} from "./routers/financialBalance";
import {cashFlowRouter} from "./routers/cashFlow";
import {financialGoalsRouter} from "./routers/cashGoals";

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5173"
}))
app.use(express.json()); // Content-type: application/json
app.use('/', mainRouter);
app.use('/costStructure', costStructureRouter);
app.use('/financialBalance', financialBalanceRouter);
app.use('/cashFlow', cashFlowRouter);
app.use('/financialGoals', financialGoalsRouter)

app.listen(5000, '0.0.0.0', () => {
    console.log('Listening on http://localhost:5000');
});
