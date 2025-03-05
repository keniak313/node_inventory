import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import * as db from "../db/queries.js";

const validateRemove = [
  body("password").custom(async (value) => {
    console.log(value);
    if (value != "haselko") {
      throw new Error("Wrong password!");
    }
  }),
];

const getNameAndWarning = async (id, type) =>{
    let name = "";
    let warningText = "";
    switch (type) {
        case "books":
          name = await db.getBookWithCategoriesById(id);
          name = name[0].title;
          break;
        case "authors":
          name = await db.getAuthorById(id);
          name = name[0].fullname;
          warningText =
            "WARNING: THIS WILL REMOVE AUTHOR AND ALL OF HIS/HER BOOKS!";
          break;
        case "categories":
          name = await db.getCategoryById(id);
          name = name[0].name;
          break;
      }
      return {name, warningText}
}

export const removeGet = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const type = req.params.type;
  res.render("remove", {
    title: "Remove",
    req: req,
    name: (await getNameAndWarning(id, type)).name,
    warningText: (await getNameAndWarning(id, type)).warningText,
  });
  //await db.removeBook(bookid);
  //res.redirect("/");
});

export const removePost = [
  validateRemove,
  async (req, res) => {
    const id = req.params.id;
    const type = req.params.type;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("remove", {
        title: "Remove",
        req: req,
        name: (await getNameAndWarning(id, type)).name,
        warningText: (await getNameAndWarning(id, type)).warningText,
        errors: errors.array(),
      });
    }
    switch (type) {
      case "books":
        await db.removeBook(id);
        res.redirect("/");
        break;
      case "authors":
        await db.removeAuthor(id);
        res.redirect("/");
        break;
      case "categories":
        await db.removeTag(id);
        res.redirect("/");
        break;
    }
  },
];
