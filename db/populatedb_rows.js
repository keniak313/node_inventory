#! /usr/bin/env node
import "dotenv/config";
import pg from "pg";
const { Client } = pg;


//REPLACE WITH NEEDED DEFAULT DB VALUES
const SQL = `
INSERT INTO authors (firstName, lastName)
VALUES
  ('J.R.R.', 'Tolkien'),
  ('Haruki', 'Murakami');

INSERT INTO books (author_id, title, pages, year)
VALUES
  ('1', 'The Fellowship of the Ring', '423', '1954'),
  ('1', 'The Two Towers', '352', '1954'),
  ('1', 'The Return of the King', '416', '1955'),
  ('2', 'After Dark', '208', '2007'),
  ('2', '1Q84', '928', '2011');
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
