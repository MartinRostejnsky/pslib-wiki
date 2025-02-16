"use server";

import { auth } from "@clerk/nextjs/server";
import {
  COLLECTIONS_NAME,
  connectionPool,
  CONTAINS_NAME,
  DOCUMENTS_NAME,
  FOLDER_CONTAINS_NAME,
  FOLDERS_NAME,
} from "@/lib/surrealdb";
import {
  Collection,
  CollectionContent,
  Contains,
  FolderContains,
} from "@/lib/types";
import { revalidateTag } from "next/cache";

export async function UpdateDocumentName(id: string, name: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in" };
  }

  const db = await connectionPool.acquire();
  try {
    // language=SQL format=false
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
    // language=SQL format=false
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
    // language=SQL format=false
    const [folderRelation] = await db.query<[FolderContains[]]>(
      `SELECT *
       FROM ${FOLDER_CONTAINS_NAME}
       WHERE out = ${id}`,
    );

    if (folderRelation.length > 0)
      // language=SQL format=false
      await db.query(`DELETE ${folderRelation[0].id};`);

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

export async function NewCollection(name: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "You must be signed in" };
  }

  const db = await connectionPool.acquire();
  try {
    // language=SQL format=false
    return await db
      .query<[Collection[]]>(`CREATE ${COLLECTIONS_NAME} SET name = $name`, {
        name: name,
      })
      .then((result) => {
        if (!result) return undefined;
        const collection = result[0][0];
        return {
          id: collection.id.toString(),
          name: collection.name,
          createdAt: collection.createdAt,
        };
      });
  } finally {
    connectionPool.release(db);
  }
}

export async function GetCollections() {
  const db = await connectionPool.acquire();
  try {
    // language=SQL format=false
    return await db
      .query<[Collection[]]>(`SELECT * FROM ${COLLECTIONS_NAME}`)
      .then((result) => {
        if (!result) return [];
        const collections = result[0];
        return collections.map((collection) => {
          return {
            id: collection.id.toString(),
            name: collection.name,
            createdAt: collection.createdAt,
          };
        });
      });
  } finally {
    connectionPool.release(db);
  }
}

export async function MoveToCollection(
  id: string,
  collectionId: string | null,
) {
  const db = await connectionPool.acquire();
  try {
    // language=SQL format=false
    const [folderRelation] = await db.query<[FolderContains[]]>(
      `SELECT * FROM ${FOLDER_CONTAINS_NAME} WHERE out = ${id}`,
    );

    if (folderRelation.length > 0)
      // language=SQL format=false
      await db.query(`DELETE ${folderRelation[0].id};`);

    // language=SQL format=false
    const [collectionRelation] = await db.query<[Contains[]]>(
      `SELECT *
       FROM ${CONTAINS_NAME}
       WHERE out = ${id}`,
    );

    if (collectionRelation.length > 0)
      // language=SQL format=false
      await db.query(`DELETE ${collectionRelation[0].id};`);

    if (!collectionId) {
      revalidateTag("documents");
      return;
    }
    // language=SQL format=false
    await db.query(`RELATE ${collectionId}->${CONTAINS_NAME}->${id}`);
    revalidateTag("documents");
  } finally {
    connectionPool.release(db);
  }
}

export async function GetContent(
  collectionId: string,
): Promise<CollectionContent> {
  if (collectionId === "") return {} as CollectionContent;
  const db = await connectionPool.acquire();
  try {
    return await db
      // language=SQL format=false
      .query<[CollectionContent[]]>(
        `SELECT *, (SELECT *, (SELECT * FROM ->${FOLDER_CONTAINS_NAME}->${DOCUMENTS_NAME}) AS documents
         FROM ->${CONTAINS_NAME}->${FOLDERS_NAME}) AS folders, (
         SELECT *
         FROM ->${CONTAINS_NAME}->${DOCUMENTS_NAME}) AS documents
         FROM ${COLLECTIONS_NAME}
         WHERE id = ${collectionId};`,
      )
      .then((result) => {
        if (!result) return {} as CollectionContent;
        const collection = result[0][0];
        if (!collection) return {} as CollectionContent;

        return {
          id: collection.id.toString(),
          name: collection.name,
          createdAt: collection.createdAt,
          documents: collection.documents.map((doc) => {
            return {
              id: doc.id.toString(),
              name: doc.name,
              content: doc.content,
              createdAt: doc.createdAt,
            };
          }),
          folders: collection.folders.map((folder) => {
            return {
              id: folder.id.toString(),
              name: folder.name,
              createdAt: folder.createdAt,
              documents: folder.documents.map((doc) => {
                return {
                  id: doc.id.toString(),
                  name: doc.name,
                  content: doc.content,
                  createdAt: doc.createdAt,
                };
              }),
            };
          }),
        };
      });
  } finally {
    connectionPool.release(db);
  }
}
