import { RecordId } from "surrealdb";

export type Document = {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
};

export type Folder = {
  id: string;
  name: string;
  createdAt: Date;
};

export type FolderContains = {
  id: RecordId<"folderContains">;
  in: RecordId<"folders">;
  out: RecordId<"documents">;
};
