import * as db from "../db/queries.js";
import { body, check, validationResult } from "express-validator";
import { checkIfExists } from "../validations/validations.js";
import asyncHandler from "express-async-handler";

const validateAuthor = [
  body("firstName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("First Name Cannot be empty")
    .matches(/^[A-Za-z0-9 .,'!&]+$/)
    .withMessage("First Name contains not valid symbols.")
    .isLength({ min: 3, max: 30 })
    .withMessage("First Name must be between 3 and 30 characters."),
  body("lastName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Last Name Cannot be empty")
    .matches(/^[A-Za-z0-9 .,'!&]+$/)
    .withMessage("Last Name contains not valid symbols.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Last Name must be between 3 and 30 characters."),
];

export const getAuthorsList = async (req, res) => {
  const authors = await db.getAuthorsList();
  res.render("authors", { title: "Authors", authors: authors });
};

export const addAuthorGet = asyncHandler(async (req, res) => {
  res.render("authorForm", { title: "Add Author", edit: false, author: [] });
});

export const addAuthorPost = [
  validateAuthor,
  body().custom(async (value) => {
    const fullName = `${value.firstName} ${value.lastName}`;
    console.log(fullName);
    await checkIfExists(
      fullName,
      db.checkIfExists("authors", "fullname", fullName),
    );
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("authorForm", {
        title: "Add Author",
        edit: false,
        author: [],
        errors: errors.array(),
      });
    }
    const author = req.body;
    await db.addAuthor(author);
    res.redirect("/authors");
  },
];

// export const addAuthorPost = asyncHandler(async (req, res) => {
//   const author = req.body;
//   await db.addAuthor(author);
//   res.redirect("/authors");
// });

export const editAuthorGet = asyncHandler(async (req, res) => {
  const authorId = req.params.authorId;
  const author = await db.getAuthorById(authorId);
  console.log(req.params.authorId);
  res.render("authorForm", {
    title: "Edit Author",
    edit: true,
    author: author[0],
  });
});

export const editAuthorPost = [
  validateAuthor,
  async (req, res) => {
    const authorId = req.params.authorId;
    const author = await db.getAuthorById(authorId);
    const newAuthor = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("authorForm", {
        title: "Edit Author",
        edit: true,
        author: author[0],
        errors: errors.array(),
      });
    }
    await db.updateAuthor(authorId, newAuthor);
    res.redirect("/authors");
  },
];

// export const editAuthorPost = asyncHandler(async (req, res) => {
//   const authorId = req.params.authorId;
//   const author = req.body;
//   await db.updateAuthor(authorId, author);
//   res.redirect("/authors");
// });

export const removeAuthorGet = asyncHandler(async (req, res) => {
  const authorId = req.params.authorId;
  await db.removeAuthor(authorId);
  res.redirect("/authors");
});


export const showBooksByAuthor = asyncHandler(async (req, res) =>{
  const authorId = req.params.authorId;
  const author = await db.getAuthorById(authorId);
  const books = await db.getBooksByAuthorId(authorId);
  res.render("authorsSort", {title: req.params.authorName, author: author[0], books: books})
})