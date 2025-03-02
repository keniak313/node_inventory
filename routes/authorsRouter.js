import { Router } from "express";
import * as authorsController from '../controllers/authorsController.js'

export const authorsRouter = Router();

authorsRouter.get("/", authorsController.getAuthorsList);