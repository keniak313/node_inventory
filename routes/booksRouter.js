import { Router } from "express";
import * as booksController from "../controllers/booksController.js";
import * as removeController from "../controllers/removeController.js";

export const booksRouter = Router();

booksRouter.get("/", booksController.booksListGet);
booksRouter.get("/addBook", booksController.addBookGet);
booksRouter.post("/createBook", booksController.addBookPost);
booksRouter.get("/editBook/:bookid", booksController.editBookGet);
booksRouter.post("/updateBook/:bookid", booksController.editBookPost);

//Tags
booksRouter.get("/addTag", booksController.addCategoryGet);
booksRouter.post("/addTag", booksController.addCategoryPost);
booksRouter.get("/tag/:tagName", booksController.getTagsListByName);
