"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouter = void 0;
const express_1 = require("express");
const bcrypt = __importStar(require("bcrypt"));
const user_record_1 = __importDefault(require("../record/user.record"));
const jwt = require("jsonwebtoken");
exports.loginRouter = (0, express_1.Router)();
exports.loginRouter.post("/", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await user_record_1.default.getOne(email);
        if (!userData) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const passwordValidation = await bcrypt.compare(password, userData.password);
        if (!passwordValidation) {
            return res.status(401).json({ message: "Invalid password" });
        }
        if (passwordValidation && process.env.SECRET_KEY) {
            const accessToken = jwt.sign({ mail: userData.email }, process.env.SECRET_KEY);
            res.json({ accessToken: accessToken });
        }
        else {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
