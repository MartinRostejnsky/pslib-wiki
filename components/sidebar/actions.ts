"use server";

import { auth } from "@clerk/nextjs/server";
import { connectionPool, FOLDER_CONTAINS_NAME } from "@/lib/surrealdb";
import { FolderContains } from "@/lib/types";
import { revalidateTag } from "next/cache";

export async function UpdateDocumentName(id: string, name: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in" };
  }

  const db = await connectionPool.acquire();
  try {
    await db.query(
      `UPDATE ${id}
       SET name = "${name}"`,
    );
    revalidateTag("documents");
  } finally {
    connectionPool.release(db);
  }
}

export async function DeleteDocument(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const db = await connectionPool.acquire();
  try {
    await db.query(`DELETE ${id}`);
    revalidateTag("documents");
    return true;
  } finally {
    connectionPool.release(db);
  }
}

export async function MoveDocument(id: string, folderId: string | null) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in" };
  }

  const db = await connectionPool.acquire();
  try {
    const [folder_relation] = await db.query<[FolderContains[]]>(
      `SELECT *
       FROM ${FOLDER_CONTAINS_NAME}
       WHERE out = ${id}`,
    );

    if (folder_relation.length > 0)
      await db.query(`DELETE ${folder_relation[0].id};`);

    if (!folderId) {
      revalidateTag("documents");
      return;
    }
    // language=SQL format=false
    await db.query(`RELATE ${folderId}->${FOLDER_CONTAINS_NAME}->${id}`);
    revalidateTag("documents");
  } finally {
    connectionPool.release(db);
  }
}
