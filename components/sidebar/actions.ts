"use server";

import { auth } from "@clerk/nextjs/server";
import {
  DOCUMENTS_NAME,
  FOLDER_CONTAINS_NAME,
  FOLDERS_NAME,
  getDb,
} from "@/lib/surrealdb";
import { FolderContains } from "@/lib/types";
import { RecordId } from "surrealdb";

export async function UpdateDocumentName(id: string, name: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in" };
  }

  const db = await getDb();
  await db.query(`UPDATE ${DOCUMENTS_NAME}:${id} SET name = $name`, {
    name,
  });
}

export async function DeleteDocument(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in" };
  }

  const db = await getDb();
  await db.delete(new RecordId(DOCUMENTS_NAME, id));
}

export async function MoveDocument(id: string, folderId: string | null) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in" };
  }

  if (!folderId) return;

  const db = await getDb();
  await db.insertRelation<FolderContains>(FOLDER_CONTAINS_NAME, {
    in: new RecordId(FOLDERS_NAME, folderId),
    out: new RecordId(DOCUMENTS_NAME, id),
  } as unknown as FolderContains);
}
