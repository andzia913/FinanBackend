import { Request, Response, Router } from "express";
import { GoalService } from "../services/GoalService";
import { UserRepository } from "../repositories/userRepository";

export const cashGoalsRouter = Router();

cashGoalsRouter.get("/", async (req: Request, res: Response) => {
    try {
        const user_email = req.body.user_email;
        const user = await UserRepository.findOneBy({ email: user_email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const goals = await GoalService.listAllWithSum(user);
        res.json(goals);
    } catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

cashGoalsRouter.post("/add/dedicated-amount", async (req: Request, res: Response) => {
    try {
        const { goal_name, value, user_email } = req.body;
        const user = await UserRepository.findOneBy({ email: user_email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await GoalService.addDedicatedAmount(user, goal_name, value);
        res.status(201).json({ message: "Dedicated amount added successfully" });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

cashGoalsRouter.post("/add", async (req: Request, res: Response) => {
    try {
        const user_email = req.body.user_email;
        const user = await UserRepository.findOneBy({ email: user_email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { goal_name, value, date } = req.body;

        if (!goal_name || !value || !date) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const newGoal = await GoalService.insert(user, { goal_name, value, date });
        res.status(201).json({ id: newGoal.id });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
