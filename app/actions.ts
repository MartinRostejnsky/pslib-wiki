"use server";

import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/surrealdb";
import { Document, Folder } from "@/lib/types";

export async function createDocument(name: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in", id: "" };
  }

  const db = await getDb();
  const [document] = await db.create<Document>("documents", {
    name: name,
    content: "<p></p>",
    folderId: "",
  } as unknown as Document);

  return {
    message: "created a new document",
    id: document.id.id,
  };
}

export async function createFolder(name: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in", id: "" };
  }

  const db = await getDb();
  await db.create<Folder>("folders", {
    name: name,
  } as unknown as Folder);

  return {
    message: "created a new folder",
  };
}

export async function saveDocument(id: string, content: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in" };
  }

  const db = await getDb();
  console.log(`UPDATE ${id} SET content = '${content}';`);
  await db.query(`UPDATE ${id} SET content = '${content}';`);
}
