"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashFlowRouter = void 0;
const express_1 = require("express");
exports.cashFlowRouter = (0, express_1.Router)();
exports.cashFlowRouter
    .get('/', async (req, res) => {
    res.send('cashflow');
});
