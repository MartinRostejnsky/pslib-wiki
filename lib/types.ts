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

export type Collection = {
  id: string;
  name: string;
  createdAt: Date;
};

export type Contains = {
  id: RecordId<"contains">;
  in: RecordId<"collections">;
  out: RecordId<"folders" | "documents">;
};

export interface FolderDocuments extends Folder {
  documents: Document[];
}

export interface CollectionContent extends Collection {
  folders: FolderDocuments[];
  documents: Document[];
}
