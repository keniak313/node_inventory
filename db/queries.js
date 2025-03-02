import { pool } from "./pool.js";

export const getBooksList = async () => {
  const { rows } = await pool.query(
    "SELECT *, books.id FROM books INNER JOIN authors ON books.authorid = authors.id ORDER BY authorid, year",
  );
  return rows;
};

export const getAuthorsList = async () => {
  const { rows } = await pool.query(
    "SELECT *, (SELECT COUNT(*) AS books FROM books WHERE authors.id = books.authorid) FROM authors",
  );
  return rows;
};

export const addBook = async (authorid, title, pages, year) => {
  await pool.query(
    "INSERT INTO books(authorid, title, pages, year) VALUES($1, $2, $3, $4)",
    [authorid, title, pages, year],
  );
};

export const getBookByID = async (bookid) => {
  const { rows } = await pool.query("SELECT * FROM books WHERE id=$1", [
    bookid,
  ]);
  return rows;
};

export const updateBook = async (bookid, book) => {
  await pool.query(
    "UPDATE books SET authorid=$2, title=$3, pages=$4, year=$5 WHERE id=$1",
    [bookid, book.authorid, book.title, book.pages, book.year],
  );
};

export const removeBook = async (bookid) => {
  await pool.query("DELETE FROM books WHERE id=$1", [bookid]);
};
