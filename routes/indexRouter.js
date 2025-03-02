import { Router } from "express";
import * as indexController from "../controllers/indexController.js"

export const indexRouter = Router();


indexRouter.get("/", indexController.booksListGet)
indexRouter.get("/addBook", indexController.addBookGet)
indexRouter.post("/createBook", indexController.createBookPost)
indexRouter.get("/editBook/:bookid", indexController.editBookGet)
indexRouter.post("/updateBook/:bookid", indexController.editBookPost)
indexRouter.get("/removeBook/:bookid", indexController.removeBookGet)