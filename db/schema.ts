import {pgTable, text, varchar} from "drizzle-orm/pg-core";

export const Documents = pgTable(
    "documents",
    {
        id: varchar({length: 255}).primaryKey(),
        content: text().notNull()
    }
)