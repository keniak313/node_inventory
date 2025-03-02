import * as db from '../db/queries.js'

export const getAuthorsList = async (req, res) =>{
    const authors = await db.getAuthorsList();
    //res.send(authors);
    res.render("authors", {title: "Authors" ,authors: authors});
}