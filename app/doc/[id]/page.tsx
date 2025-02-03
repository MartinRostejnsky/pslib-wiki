import Editor from "@/components/Editor";
import {db} from "@/db/drizzle";
import {Documents} from "@/db/schema";
import {eq} from "drizzle-orm";
import {redirect} from "next/navigation";
import {SignedIn, SignedOut} from "@clerk/nextjs";

function getDocument(id: string) {
    return db.select().from(Documents).where(eq(Documents.id, id)).limit(1).execute()
}

export default async function Page({params}: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const rows = await getDocument(id);
    if (rows.length !== 1) {
        redirect("/");
    }
    const document = rows[0];

    return (
        <div className={"flex justify-center"}>
            <SignedOut>
                <div className={"my-4 mx-8 prose prose-invert prose-base prose-p:mt-0 prose-headings:mb-4 prose-p:mb-2"} dangerouslySetInnerHTML={{__html: document.content}} />
            </SignedOut>
            <SignedIn>
                <Editor content={document.content} id={id}/>
            </SignedIn>
        </div>
    );
}