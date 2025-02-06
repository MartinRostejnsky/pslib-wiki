"use server";

import { Document } from "./types";
import { Surreal } from "surrealdb";

let db: Surreal;

export async function getDb() {
  if (db) return db;
  if (!process.env.DB_URL) {
    throw new Error("No DB_URL is set");
  }

  db = new Surreal();

  await db.connect(process.env.DB_URL);
  await db.signin({
    username: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
  });

  await db.use({
    namespace: process.env.DB_NAMESPACE,
    database: process.env.DB_DATABASE,
  });

  await runMigrations(db);

  return db;
}

async function runMigrations(db: Surreal) {
  try {
    await db.query(
      "DEFINE TABLE IF NOT EXISTS documents SCHEMAFULL;" +
        "DEFINE FIELD IF NOT EXISTS name ON TABLE documents TYPE string;" +
        "DEFINE FIELD IF NOT EXISTS content ON TABLE documents TYPE string;" +
        "DEFINE FIELD IF NOT EXISTS createdAt ON TABLE documents TYPE datetime DEFAULT time::now() READONLY;",
    );
  } catch (migrationError) {
    console.error("Migration error:", migrationError);
  }
}

export async function createDocument(name: string) {
  const db = await getDb();

  const [person] = await db
    .insert<Document>("documents", {
      name: name,
      content: "",
    } as Document)
    .catch((err) => {
      throw new err();
    });

  return person;
}
