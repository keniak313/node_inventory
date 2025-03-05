import { Router } from "express";
import * as removeController from "../controllers/removeController.js";

export const removeRouter = Router();

removeRouter.get("/:id.:type", removeController.removeGet);
removeRouter.post("/:id.:type", removeController.removePost);