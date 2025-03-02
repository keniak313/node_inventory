#! /usr/bin/env node
import "dotenv/config";
import pg from "pg";
const { Client } = pg;


//REPLACE WITH NEEDED DEFAULT DB VALUES
const SQL = `
CREATE TABLE IF NOT EXISTS authors (
    author_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    authorName VARCHAR ( 255 ),
    image VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS books (
    book_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    author_id INTEGER,
    bookName VARCHAR( 255 ),
    category VARCHAR( 255 ),
    year DATE,
    image VARCHAR( 255 )
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
