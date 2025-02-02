"use server"

import { db } from "@/db/drizzle"
import {Documents} from "@/db/schema";
import {eq} from "drizzle-orm";

export async function UpdateDocumentName(id: string, name: string) {
    await db.update(Documents).set({
        name: name
    }).where(eq(Documents.id, id));
}