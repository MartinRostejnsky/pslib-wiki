"use server"

import {db} from "@/db/drizzle";
import {Documents} from "@/db/schema";
import {uuidv4} from "lib0/random";
import {eq} from "drizzle-orm";

export async function createDocument(name: string) {
    let id = uuidv4();
    let safe = false;
    while (!safe) {
        const row = await db.select().from(Documents).where(eq(Documents.id, id)).limit(1).execute();
        if (row.length === 0) {
            safe = true;
        } else {
            id = uuidv4();
        }
    }

    await db.insert(Documents).values({
        id: id,
        name: name,
        content: "<p></p>"
    });
}