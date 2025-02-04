"use server"

import { db } from "@/db/drizzle"
import {Documents} from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import {eq} from "drizzle-orm";

export async function UpdateDocumentName(id: string, name: string) {
    const { userId } = await auth()

    if (!userId) {
        return { message: 'You must be signed in' }
    }

    await db.update(Documents).set({
        name: name
    }).where(eq(Documents.id, id));
}

export async function DeleteDocument(id: string) {
    const { userId } = await auth()

    if (!userId) {
        return { message: 'You must be signed in' }
    }

    await db.delete(Documents).where(eq(Documents.id, id));
}

export async function MoveDocument(id: string, folderId: string | null) {
    const { userId } = await auth()

    if (!userId) {
        return { message: 'You must be signed in' }
    }

    await db.update(Documents).set({
        folderId: folderId
    }).where(eq(Documents.id, id));
}