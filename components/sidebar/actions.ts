"use server"

import { db } from "@/db/drizzle"
import {Documents} from "@/db/schema";
import {eq} from "drizzle-orm";

export async function UpdateDocumentName(id: string, name: string) {
    await db.update(Documents).set({
        name: name
    }).where(eq(Documents.id, id));
}

export async function DeleteDocument(id: string) {
    await db.delete(Documents).where(eq(Documents.id, id));
}