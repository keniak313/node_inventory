import { Router } from "express";
import * as booksController from "../controllers/booksController.js"

export const booksRouter = Router();


booksRouter.get("/", booksController.booksListGet)
booksRouter.get("/addBook", booksController.addBookGet)
booksRouter.post("/createBook", booksController.createBookPost)
booksRouter.get("/editBook/:bookid", booksController.editBookGet)
booksRouter.post("/updateBook/:bookid", booksController.editBookPost)
booksRouter.get("/removeBook/:bookid", booksController.removeBookGet)

//Tags
booksRouter.get("/addTag", booksController.addCategoryGet)
booksRouter.post("/addTag", booksController.addCategoryPost)
booksRouter.get("/tag/:tagName", booksController.getTagsListByName)
