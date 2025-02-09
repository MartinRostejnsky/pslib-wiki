import { SidebarMenu } from "@/components/ui/sidebar";
import DocumentButton from "@/components/sidebar/DocumentButton";
import {
  connectionPool,
  DOCUMENTS_NAME,
  FOLDER_CONTAINS_NAME,
  FOLDERS_NAME,
} from "@/lib/surrealdb";
import { Document, type Folder } from "@/lib/types";
import { default as FolderMenu } from "./Folder";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export interface FolderDocuments extends Folder {
  documents: Document[];
}

async function getFolderContents() {
  const db = await connectionPool.acquire();
  try {
    // language=SQL format=false
    const folders = await db
      .query<
        [FolderDocuments[]]
      >(`SELECT *, (SELECT * FROM ->folderContains->documents) AS documents FROM folders`)
      .then((rows) => {
        if (!rows) return [];
        const folders = rows[0];
        return folders.map((items) => {
          return {
            id: items.id.toString(),
            name: items.name,
            documents: items.documents.map((document) => {
              return {
                id: document.id.toString(),
                name: document.name,
                content: document.content,
                createdAt: document.createdAt,
              };
            }),
            createdAt: items.createdAt,
          };
        });
      });

    const orphans = await db
      .query<[Document[]]>(
        `SELECT *
         FROM ${DOCUMENTS_NAME}
         WHERE id NOT IN (SELECT VALUE out FROM ${FOLDER_CONTAINS_NAME})`,
      )
      .then((rows) => {
        if (!rows) return [];
        const documents = rows[0];
        return documents.map((document) => {
          return {
            id: document.id.toString(),
            name: document.name,
          };
        });
      });

    return {
      folders,
      orphans,
    };
  } finally {
    connectionPool.release(db);
  }
}

async function getFolders() {
  const db = await connectionPool.acquire();

  try {
    const rows = await db.query<[Folder[]]>(`SELECT * FROM ${FOLDERS_NAME}`);
    if (!rows) return [];
    const folders = rows[0];
    return folders.map((folder) => {
      return {
        id: folder.id.toString(),
        name: folder.name,
      };
    });
  } finally {
    connectionPool.release(db);
  }
}

export default async function DocumentsMenu() {
  "use cache";
  cacheTag("documents");
  const { folders, orphans } = await getFolderContents();
  const folderNames = await getFolders();

  return (
    <SidebarMenu>
      {folders.map((folder) => (
        <FolderMenu folder={folder} folderNames={folderNames} key={folder.id} />
      ))}

      {/* Render documents without a folder */}
      {orphans.length > 0 &&
        orphans.map((item) => (
          <DocumentButton
            key={item.id}
            item={item}
            folders={folderNames}
            submenu={false}
          />
        ))}
    </SidebarMenu>
  );
}
