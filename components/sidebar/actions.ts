"use server";

import { auth } from "@clerk/nextjs/server";
import { FOLDER_CONTAINS_NAME, getDb } from "@/lib/surrealdb";
import { FolderContains } from "@/lib/types";

export async function UpdateDocumentName(id: string, name: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in" };
  }

  const db = await getDb();
  await db.query(
    `UPDATE ${id}
     SET name = $name`,
    {
      name,
    },
  );
}

export async function DeleteDocument(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in" };
  }

  const db = await getDb();
  await db.query(`DELETE ${id}`);
}

export async function MoveDocument(id: string, folderId: string | null) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in" };
  }

  const db = await getDb();

  const [folder_relation] = await db.query<[FolderContains[]]>(
    `SELECT * FROM ${FOLDER_CONTAINS_NAME} WHERE out = ${id}`,
  );
  console.log(folder_relation);

  if (folder_relation.length > 0)
    await db.query(`DELETE ${folder_relation[0].id};`);

  if (!folderId) return;
  await db.query(`RELATE ${folderId} -> ${FOLDER_CONTAINS_NAME} -> ${id}`);
}
