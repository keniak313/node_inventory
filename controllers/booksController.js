import asyncHandler from "express-async-handler";
import { CustomNotFoundError } from "../errors/CustomNotFoundError.js";
import * as db from "../db/queries.js";

export const booksListGet = asyncHandler(async (req, res) => {
  const books = await db.getBooksWithCategories();
  const categories = await db.getCategories(); //Te u gory
  //res.send(books);
  res.render("books", { title: "Books", books: books, categories: categories });
});

export const addBookGet = asyncHandler(async (req, res) => {
  const authors = await db.getAuthorsList();
  const categories = await db.getCategories();
  res.render("bookForm", {
    title: "Add Book",
    authors: authors,
    book: {},
    categories: categories,
    action: "add",
  });
});

export const createBookPost = asyncHandler(async (req, res) => {
  const newBook = req.body;
  const categories = req.body.categories;
  const book = await db.addBook(
    newBook.authorid,
    newBook.title,
    newBook.pages,
    newBook.year,
  );
  await categories.map(async (category, index) => {
    categories[index] = `(${book[0].id}, ${category})`;
  });
  await db.addBooksCategories(book[0].id, categories.join(", "));
  res.redirect("/");
});

export const editBookGet = asyncHandler(async (req, res) => {
  const bookid = req.params.bookid;
  const book = await db.getBookWithCategoriesById(bookid);
  const authors = await db.getAuthorsList();
  const categories = await db.getCategories();
  console.log(categories);
  console.log(book);
  res.render("bookForm", {
    title: "Edit Book",
    authors: authors,
    book: book[0],
    categories: categories,
    action: "update",
  });
  //res.send(book[0]);
});

export const editBookPost = asyncHandler(async (req, res) => {
  const bookid = req.params.bookid;
  const book = req.body;
  const categories = req.body.categories;
  await categories.map(async (category, index) => {
    categories[index] = `(${bookid}, ${category})`;
  });
  await db.addBooksCategories(bookid, categories.join(", "));
  await db.updateBook(bookid, book, categories);
  res.redirect("/");
});

export const removeBookGet = asyncHandler(async (req, res) => {
  const bookid = req.params.bookid;
  await db.removeBook(bookid);
  res.redirect("/");
});

//Tags

export const getTagsListByName = asyncHandler(async (req, res) => {
  res.send(req.params)
});

export const addCategoryGet = asyncHandler(async (req, res) => {
  res.render("tagForm", { title: "New Tag" });
});

export const addCategoryPost = asyncHandler(async (req, res) => {
  const name = req.body.name;
  await db.addCategory(name);
  res.redirect("/");
});
