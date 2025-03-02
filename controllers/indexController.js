import asyncHandler from "express-async-handler";
import { CustomNotFoundError } from "../errors/CustomNotFoundError.js";
import * as db from "../db/queries.js";

export const booksListGet = asyncHandler(async (req, res) => {
  const books = await db.getBooksList();
  //res.send(books);
  res.render("index", { title: "Books", books: books });
});

export const addBookGet = asyncHandler(async (req, res) => {
  const authors = await db.getAuthorsList();
  res.render("addBook", { title: "Add Book", authors: authors });
});

export const createBookPost = asyncHandler(async (req, res) => {
  const newBook = req.body;
  await db.addBook(
    newBook.authorid,
    newBook.title,
    newBook.pages,
    newBook.year,
  );
  res.redirect("/");
});

export const editBookGet = asyncHandler(async (req, res) => {
  const bookid = req.params.bookid;
  const book = await db.getBookByID(bookid);
  const authors = await db.getAuthorsList();
  res.render("editBook", { title: "Edit Book", authors: authors, book: book[0] });
   //res.send(book[0]);
});

export const editBookPost = asyncHandler(async (req,res) =>{
  const bookid = req.params.bookid;
  const book = req.body;
  //res.send(bookid)
  await db.updateBook(bookid, book);
  res.redirect("/")
})

export const removeBookGet = asyncHandler(async (req, res) =>{
  const bookid = req.params.bookid;
  await db.removeBook(bookid);
  res.redirect("/");
})