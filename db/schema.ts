import {pgTable, text, varchar} from "drizzle-orm/pg-core";

export const Documents = pgTable(
    "documents",
    {
        id: varchar({length: 255}).primaryKey(),
        name: varchar({length: 255}).notNull(),
        content: text().notNull()
    }
)