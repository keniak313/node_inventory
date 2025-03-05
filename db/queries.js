import { pool } from "./pool.js";

//Authors
export const getAuthorsList = async () => {
  const { rows } = await pool.query(
    "SELECT *, (SELECT COUNT(*) AS books FROM books WHERE authors.id = books.author_id) FROM authors ORDER BY lastname",
  );
  return rows;
};

export const addAuthor = async (author) => {
  await pool.query(
    "INSERT INTO authors (firstname, lastname, fullname) VALUES ($1, $2, $3)",
    [
      author.firstName,
      author.lastName,
      author.firstName + " " + author.lastName,
    ],
  );
};

export const getAuthorById = async (authorId) => {
  const { rows } = await pool.query(
    `SELECT * FROM authors WHERE id=${authorId}`,
  );
  return rows;
};

export const updateAuthor = async (authorId, author) => {
  await pool.query(
    `UPDATE authors SET firstname='${author.firstName}', lastname='${author.lastName}', fullname='${author.firstName} ${author.lastName}' WHERE id=${authorId}`,
  );
};

export const removeAuthor = async (authorId) => {
  await pool.query(`DELETE FROM authors WHERE id=${authorId}`);
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

export const removeBook = async (bookId) => {
  await pool.query("DELETE FROM books WHERE id=$1", [bookId]);
};

export const getBooksByAuthorId = async (authorId) => {
  const { rows } = await pool.query(
    `SELECT b.id, b.title, b.pages, b.year, a.fullname FROM books b JOIN authors a ON b.author_id = a.id AND b.author_id = '${authorId}'`,
  );
  return rows;
};

//Categories
export const getBooksWithCategories = async () => {
  const { rows } = await pool.query(
    `SELECT b.id, b.author_id, a.fullname, title, year, pages, array_agg(name) FROM categories c 
    JOIN books_categories bc ON bc.category_id = c.id 
    RIGHT JOIN books b ON b.id = bc.book_id
    JOIN authors a ON b.author_id = a.id
    GROUP BY b.id, a.id`,
  );
  return rows;
};

export const getEmptyCategory = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM categories WHERE name='None'`,
  );
  return rows;
};

const checkNullCategory = async () => {
  const { rows } = await pool.query(`
      SELECT b.id, c.name category_name
      FROM categories c 
        JOIN books_categories bc ON bc.category_id = c.id 
        RIGHT JOIN books b ON b.id = bc.book_id
	      JOIN authors a ON b.author_id = a.id
        AND c.name IS NULL
        `);
  console.log(rows);
  const emptyCatId = await getEmptyCategory();
  console.log(emptyCatId);
  await rows.map(async (book) => {
    console.log(`(${book.id}, ${emptyCatId[0].id})`);
    addBooksCategories(book.id, `(${book.id}, ${emptyCatId[0].id})`);
  });
};

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

export const removeTag = async (tagId) => {
  await pool.query(`DELETE FROM categories WHERE id = ${tagId}`);
  await checkNullCategory();
};

export const getBookWithCategoriesById = async (bookid) => {
  const { rows } = await pool.query(
    `SELECT b.id, author_id, title, year, pages, array_agg(name) FROM categories c 
    JOIN books_categories bc ON bc.category_id = c.id 
    JOIN books b ON b.id = bc.book_id AND b.id = ${bookid}
    GROUP BY b.id`,
  );
  return rows;
};

export const addBooksCategories = async (bookid, categories) => {
  await pool.query(
    "DELETE FROM books_categories WHERE books_categories.book_id = $1",
    [bookid],
  );
  pool.query(
    `INSERT INTO books_categories (book_id, category_id) VALUES ${categories}`,
  );
};

export const getBooksByTag = async (tagName) => {
  console.log(tagName);
  const { rows } = await pool.query(
    `SELECT title, a.fullname, a.firstname, a.lastname, c.name, b.year, b.pages, b.id FROM books b
      JOIN books_categories bc ON bc.book_id = b.id
      JOIN categories c ON c.id = bc.category_id
      JOIN authors a ON a.id = b.author_id
      AND c.name LIKE '${tagName}'`,
  );
  return rows;
};

export const checkIfExists = async (table, column, value) => {
  const { rows } = await pool.query(
    `SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END FROM ${table} WHERE ${column} ILIKE '${value}'`,
  );
  return rows[0].case;
};
