import {pgTable, text, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const Documents = pgTable(
    "documents",
    {
        id: varchar({length: 255}).primaryKey(),
        name: varchar({length: 255}).notNull(),
        content: text().notNull(),
        folderId: varchar({length: 255})
    }
);

export const DocumentsRelations = relations(Documents, ({one}) => ({
    folder: one(Folders, {
        fields: [Documents.folderId],
        references: [Folders.id]
    })
}));

export const Folders = pgTable(
    "folders",
    {
        id: varchar({length: 255}).primaryKey(),
        name: varchar({length: 255}).notNull()
    }
);

export const FoldersRelations = relations(Folders, ({many}) => ({
    documents: many(Documents)
}));