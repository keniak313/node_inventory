import { Router } from "express";
import * as authorsController from '../controllers/authorsController.js'

export const authorsRouter = Router();

authorsRouter.get("/", authorsController.getAuthorsList);
authorsRouter.get("/addAuthor", authorsController.addAuthorGet);
authorsRouter.post("/addAuthor", authorsController.addAuthorPost);
authorsRouter.get("/editAuthor/:authorId", authorsController.editAuthorGet);
authorsRouter.post("/editAuthor/:authorId", authorsController.editAuthorPost);
authorsRouter.get("/removeAuthor/:authorId", authorsController.removeAuthorGet)

//Show Books By Author
authorsRouter.get("/:authorId", authorsController.showBooksByAuthor)