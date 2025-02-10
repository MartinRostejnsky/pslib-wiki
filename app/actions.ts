"use server";

import { auth } from "@clerk/nextjs/server";
import { connectionPool, DOCUMENTS_NAME, FOLDERS_NAME } from "@/lib/surrealdb";
import { Document, Folder } from "@/lib/types";
import { revalidateTag } from "next/cache";

export async function createDocument(name: string) {
  const { userId } = await auth();

  if (!userId) {
    return "";
  }

  const db = await connectionPool.acquire();
  try {
    const [result] = await db.query<[Document[]]>(
      `
    CREATE ${DOCUMENTS_NAME} CONTENT {
      name: $name,
      content: "<p></p>"
    };
    `,
      { name: name },
    );
    revalidateTag("documents");
    return result[0].id.toString();
  } finally {
    connectionPool.release(db);
  }
}

export async function createFolder(name: string) {
  const { userId } = await auth();

  if (!userId) {
    return "";
  }

  const db = await connectionPool.acquire();
  try {
    const [result] = await db.query<[Folder[]]>(
      `CREATE ${FOLDERS_NAME} SET name = $name`,
      { name: name },
    );
    revalidateTag("documents");
    return result[0].id.toString();
  } finally {
    connectionPool.release(db);
  }
}

export async function saveDocument(id: string, content: string) {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const db = await connectionPool.acquire();
  try {
    await db.query(`UPDATE ${id} SET content = '${content}';`);
    return true;
  } finally {
    connectionPool.release(db);
  }
}
