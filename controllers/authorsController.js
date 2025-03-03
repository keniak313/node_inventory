import * as db from '../db/queries.js'
import asyncHandler from "express-async-handler";

export const getAuthorsList = async (req, res) =>{
    const authors = await db.getAuthorsList();
    //res.send(authors);
    res.render("authors", {title: "Authors" ,authors: authors});
}

export const addAuthorGet = asyncHandler(async (req, res) =>{
    res.render("authorForm", {title: "Add Author"});
})

export const addAuthorPost = asyncHandler(async (req, res) =>{
    const author = req.body;
    await db.addAuthor(author)
    res.redirect("/authors")
})