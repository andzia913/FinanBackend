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
exports.registerRouter = void 0;
const express_1 = require("express");
const bcrypt = __importStar(require("bcrypt"));
const user_record_1 = __importDefault(require("../record/user.record"));
exports.registerRouter = (0, express_1.Router)();
exports.registerRouter.post("/", async (req, res) => {
    try {
        const newUser = req.body;
        if (!newUser.name || !newUser.email || !newUser.password) {
            return res.status(400).json({ message: "Invalid data" });
        }
        const isUserArledyExist = await user_record_1.default.getOne(newUser.email);
        if (isUserArledyExist) {
            res.status(409).json({ message: "User with this email already exists." });
            return;
        }
        const salt = bcrypt.genSaltSync(10);
        newUser.password = bcrypt.hashSync(newUser.password, salt);
        const completedUser = { ...newUser, isAdmin: 0 };
        await user_record_1.default.insert(completedUser);
        res.status(201).json({ message: "User successfully registered" });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
