import asyncHandler from "express-async-handler";
import { CustomNotFoundError } from "../errors/CustomNotFoundError.js";
import { body, validationResult } from "express-validator";
import { checkIfExists, checkPassword } from "../validations/validations.js";
import * as db from "../db/queries.js";

const validateTag = [
  body(`name`)
    .trim()
    .escape()
    .isAlpha()
    .isLength({ min: 3, max: 30 })
    .withMessage("Must be between 3 and 30 characters long.")
    .custom(async (value) => {
      await checkIfExists(value, db.checkIfExists("categories", "name", value));
    }),
];

const validateBook = [
  body("title")
    .trim()
    .escape()
    .isLength({ min: 3, max: 30 })
    .withMessage("Title must be between 3 and 30 characters long."),
  body("year")
    .trim()
    .isInt()
    .escape()
    .withMessage("Title - Only Numbers allowed.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Title - Must be between 3 and 20 characters"),
  body("pages")
    .trim()
    .isInt()
    .escape()
    .withMessage("Pages - Only Numbers allowed.")
    .isLength({ min: 1, max: 20 })
    .withMessage("Pages - Must be between 1 and 20 characters"),
];

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

export const addBookPost = [
  validateBook,
  body("title").custom(async (value) => {
    await checkIfExists(value, db.checkIfExists("books", "title", value));
  }),
  async (req, res) => {
    const authors = await db.getAuthorsList();
    const baseCategories = await db.getCategories();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("bookForm", {
        title: "Add Book",
        authors: authors,
        book: {},
        categories: baseCategories,
        action: "add",
        errors: errors.array(),
      });
    }
    const newBook = req.body;
    let categories = req.body.categories;
    const book = await db.addBook(
      newBook.authorid,
      newBook.title,
      newBook.pages,
      newBook.year,
    );
    if (!categories) {
      //Jesli kategoria nie jest wybrana przypisz NONE
      const emptyCatId = await db.getEmptyCategory();
      console.log(emptyCatId);
      const emptyCat = `(${book[0].id}, ${emptyCatId[0].id})`;
      await db.addBooksCategories(book[0].id, emptyCat);
    } else {
      //A jesli jest dodaj je do bridga
      console.log(categories);
      await categories.map(async (category, index) => {
        categories[index] = `(${book[0].id}, ${category})`;
      });
      await db.addBooksCategories(book[0].id, categories.join(", "));
    }
    res.redirect("/");
  },
];

// export const createBookPost = asyncHandler(async (req, res) => {
//   const newBook = req.body;
//   let categories = req.body.categories;
//   const book = await db.addBook(
//     newBook.authorid,
//     newBook.title,
//     newBook.pages,
//     newBook.year,
//   );
//   if (!categories) {
//     //Jesli kategoria nie jest wybrana przypisz NONE
//     const emptyCatId = await db.getEmptyCategory();
//     console.log(emptyCatId);
//     const emptyCat = `(${book[0].id}, ${emptyCatId[0].id})`;
//     await db.addBooksCategories(book[0].id, emptyCat);
//   } else {
//     //A jesli jest dodaj je do bridga
//     console.log(categories);
//     await categories.map(async (category, index) => {
//       categories[index] = `(${book[0].id}, ${category})`;
//     });
//     await db.addBooksCategories(book[0].id, categories.join(", "));
//   }
//   res.redirect("/");
// });

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

export const editBookPost = [
  validateBook,
  async (req, res) => {
    const bookId = req.params.bookid;
    const book = await db.getBookWithCategoriesById(bookId);
    const authors = await db.getAuthorsList();
    const baseCategories = await db.getCategories();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("bookForm", {
        title: "Edit Book",
        authors: authors,
        book: book[0],
        categories: baseCategories,
        action: "update",
        errors: errors.array(),
      });
    }
    const categories = req.body.categories;
    if (!categories) {
      //Jesli kategoria nie jest wybrana przypisz NONE
      const emptyCatId = await db.getEmptyCategory();
      const emptyCat = `(${bookId}, ${emptyCatId[0].id})`;
      await db.addBooksCategories(bookId, emptyCat);
    } else {
      //A jesli jest dodaj je do bridga
      console.log(categories);
      await categories.map(async (category, index) => {
        categories[index] = `(${bookId}, ${category})`;
      });
      await db.addBooksCategories(bookId, categories.join(", "));
    }
    await db.updateBook(bookId, book, categories);
    res.redirect("/");
  },
];

// export const editBookPost = asyncHandler(async (req, res) => {
//   const bookId = req.params.bookid;
//   const book = req.body;
//   const categories = req.body.categories;
//   if (!categories) {
//     //Jesli kategoria nie jest wybrana przypisz NONE
//     const emptyCatId = await db.getEmptyCategory();
//     const emptyCat = `(${bookId}, ${emptyCatId[0].id})`;
//     await db.addBooksCategories(bookId, emptyCat);
//   } else {
//     //A jesli jest dodaj je do bridga
//     console.log(categories);
//     await categories.map(async (category, index) => {
//       categories[index] = `(${bookId}, ${category})`;
//     });
//     await db.addBooksCategories(bookId, categories.join(", "));
//   }
//   await db.updateBook(bookId, book, categories);
//   res.redirect("/");
// });

//Tags

export const getTagsListByName = asyncHandler(async (req, res) => {
  const tag = req.params.tagName;
  const categories = await db.getCategories();
  const books = await db.getBooksByTag(tag);
  res.render("tags", {
    title: "Tag List",
    books: books,
    categories: categories,
  });
});

export const addCategoryGet = asyncHandler(async (req, res) => {
  res.render("tagForm", { title: "New Tag" });
});

export const addCategoryPost = [
  validateTag,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("tagForm", { title: "New Tag", errors: errors.array() });
    }
    const name = req.body.name;
    await db.addCategory(name);
    res.redirect("/");
  },
];

// export const addCategoryPost = asyncHandler(async (req, res) => {
//   const name = req.body.name;
//   await db.addCategory(name);
//   res.redirect("/");
// });

export const removeTag = asyncHandler(async (req, res) => {
  const tagId = req.params.tagId;
  await db.removeTag(tagId);
  res.redirect("/");
});
