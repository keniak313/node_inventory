#! /usr/bin/env node
import "dotenv/config";
import pg from "pg";
const { Client } = pg;


//REPLACE WITH NEEDED DEFAULT DB VALUES
const SQL = `
CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    firstname VARCHAR ( 255 ),
    lastname VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    author_id INTEGER references authors(id),
    title VARCHAR( 255 ),
    pages INTEGER,
    year INTEGER
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR( 255 )
);

CREATE TABLE IF NOT EXISTS books_categories(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  book_id INTEGER references books(id) ON DELETE CASCADE,
  category_id INTEGER references categories(id) ON DELETE CASCADE
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done");
}

main();
