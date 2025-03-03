import { pool } from "./pool.js";

//Authors
export const getAuthorsList = async () => {
  const { rows } = await pool.query(
    "SELECT *, (SELECT COUNT(*) AS books FROM books WHERE authors.id = books.author_id) FROM authors",
  );
  return rows;
};

export const addAuthor = async (author) => {
  await pool.query(
    "INSERT INTO authors (firstname, lastname) VALUES ($1, $2)",
    [author.firstName, author.lastName],
  );
};

//Books
export const getBooksList = async () => {
  const { rows } = await pool.query(
    "SELECT *, books.id FROM books INNER JOIN authors ON books.author_id = authors.id ORDER BY author_id, year",
  );
  return rows;
};

export const addBook = async (authorid, title, pages, year) => {
  const { rows } = await pool.query(
    "INSERT INTO books(author_id, title, pages, year) VALUES($1, $2, $3, $4) RETURNING books.id",
    [authorid, title, pages, year],
  );
  return rows;
};

export const getBookByID = async (bookid) => {
  const { rows } = await pool.query("SELECT * FROM books WHERE id=$1", [
    bookid,
  ]);
  return rows;
};

export const updateBook = async (bookid, book) => {
  await pool.query(
    "UPDATE books SET author_id=$2, title=$3, pages=$4, year=$5 WHERE id=$1",
    [bookid, book.authorid, book.title, book.pages, book.year],
  );
};

export const removeBook = async (bookid) => {
  await pool.query("DELETE FROM books WHERE id=$1", [bookid]);
};

//Categories

export const getCategories = async () => {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
};

export const getCategoryById = async (id) => {
  const { rows } = await pool.query("SELECT name FROM categories WHERE id=$1", [
    id,
  ]);
  return rows;
};

export const addCategory = async (name) => {
  await pool.query(`INSERT INTO categories (name) VALUES($1)`, [name]);
};

//BOOKS_CATEGORIES

export const getBooksWithCategories = async () => {
  const { rows } = await pool.query(
    `SELECT b.id, a.firstname, a.lastname, title, year, pages, array_agg(name) FROM categories c 
    JOIN books_categories bc ON bc.category_id = c.id 
    JOIN books b ON b.id = bc.book_id
    JOIN authors a ON b.author_id = a.id
    GROUP BY b.id, a.id`,
  );
  console.log(rows)
  return rows;
};

export const getBookWithCategoriesById = async (bookid) =>{
  const { rows } = await pool.query(
    `SELECT b.id, author_id, title, year, pages, array_agg(name) FROM categories c 
    JOIN books_categories bc ON bc.category_id = c.id 
    JOIN books b ON b.id = bc.book_id AND b.id = ${bookid}
    GROUP BY b.id`,
  );
  return rows;
}

export const addBooksCategories = async (bookid, categories) => {
  await pool.query(
    "DELETE FROM books_categories WHERE books_categories.book_id = $1",
    [bookid],
  );
  pool.query(
    `INSERT INTO books_categories (book_id, category_id) VALUES ${categories}`,
  );
};
