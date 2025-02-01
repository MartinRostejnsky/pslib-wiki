import Editor from "@/components/Editor";
import {db} from "@/db/drizzle";
import {Documents} from "@/db/schema";
import {eq} from "drizzle-orm";
import {redirect} from "next/navigation";

export default async function Page({params}: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const rows = await db.select().from(Documents).where(eq(Documents.id, id)).limit(1).execute();
    if (rows.length !== 1) {
        redirect("/");
    }
    const document = rows[0];

    return (
        <Editor content={document.content}/>
    );
}