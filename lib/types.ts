import { RecordId } from "surrealdb";

export type Document = {
  id: RecordId<"documents">;
  name: string;
  content: string;
  createdAt: Date;
};

export type Folder = {
  id: RecordId<"folders">;
  name: string;
  createdAt: Date;
};

export type FolderContains = {
  id: RecordId<"folderContains">;
  in: RecordId<"folders">;
  out: RecordId<"documents">;
};

export type Collection = {
  id: RecordId<"collections">;
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
