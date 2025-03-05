import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { booksRouter } from "./routes/booksRouter.js";
import { authorsRouter } from "./routes/authorsRouter.js";
import { removeRouter } from "./routes/removeRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use("/authors", authorsRouter)
app.use("/remove", removeRouter)
app.use("/", booksRouter)




const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Listening on: ${PORT}`)
})
