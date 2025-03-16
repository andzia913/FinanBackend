import { Request, Response, Router } from "express";
import { CategoryService } from "../services/CategoryService";
import { UserService } from "../services/UserService";

export const costStructureRouter = Router();

costStructureRouter
    .get("/", async (req: Request, res: Response) => {
      try {
        const userEmail = req.body.user_email;
        const user = await UserService.getOne(userEmail);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const costStructure = await CategoryService.getCostStructure(user);
        res.json(costStructure);
      } catch (error) {
        console.error("Błąd w trakcie pobierania struktury kosztów:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })

    .post("/", async (req: Request, res: Response) => {
      try {
        const userEmail = req.body.user_email;
        const categoryName = req.body.category_name;
        if (!categoryName) {
          return res.status(400).json({ message: "Invalid data" });
        }

        const user = await UserService.getOne(userEmail);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const newCategory = await CategoryService.insert(user, categoryName);
        res.status(201).json({ id: newCategory.id });
      } catch (error) {
        console.error("Błąd podczas dodawania kategorii:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })

    // .delete("/delete/:id", async (req: Request, res: Response) => {
    //   try {
    //     const categoryId = req.params.id;
    //     const category = await CategoryService.getOne(categoryId);
    //
    //     if (!category) {
    //       return res.status(404).json({ message: "Category not found" });
    //     }
    //
    //     const isCategoryInUse = await CategoryService.isCategoryInUse(category);
    //     if (isCategoryInUse) {
    //       return res.status(400).json({
    //         message: "Cannot delete category as it is associated with another record.",
    //       });
    //     }
    //
    //     await CategoryService.delete(category);
    //     res.status(204).send();
    //   } catch (error) {
    //     console.error("Błąd podczas usuwania kategorii:", error);
    //     res.status(500).json({ message: "Internal Server Error" });
    //   }
   // });
