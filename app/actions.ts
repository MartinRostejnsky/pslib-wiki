"use server"

import {db} from "@/db/drizzle";
import {Documents, Folders} from "@/db/schema";
import {uuidv4} from "lib0/random";
import {eq} from "drizzle-orm";
import {auth} from "@clerk/nextjs/server";

export async function createDocument(name: string) {
    const {userId} = await auth()

    if (!userId) {
        return {message: 'You must be signed in', id: ""}
    }

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

    const document = await db.insert(Documents).values({
        id: id,
        name: name,
        content: "<p></p>",
        folderId: null
    }).returning();

    return {
        message: "created a new document",
        id: document[0].id
    };
}


export async function createFolder(name: string) {
    const {userId} = await auth()

    if (!userId) {
        return {message: 'You must be signed in', id: ""}
    }

    let id = uuidv4();
    let safe = false;
    while (!safe) {
        const row = await db.select().from(Folders).where(eq(Folders.id, id)).limit(1).execute();
        if (row.length === 0) {
            safe = true;
        } else {
            id = uuidv4();
        }
    }

    await db.insert(Folders).values({
        id: id,
        name: name,
    });

    return {
        message: "created a new folder",
    };
}

export async function saveDocument(id: string, content: string) {
    const {userId} = await auth()

    if (!userId) {
        return {message: 'You must be signed in'}
    }

    await db.update(Documents).set({
        content: content
    }).where(eq(Documents.id, id));
}