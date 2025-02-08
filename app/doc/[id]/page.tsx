import Editor from "@/components/Editor";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { DOCUMENTS_NAME, getDb } from "@/lib/surrealdb";
import { Document } from "@/lib/types";
import { RecordId } from "surrealdb";
import { redirect } from "next/navigation";

async function getDocument(id: string) {
  const db = await getDb();
  return db.select<Document>(new RecordId(DOCUMENTS_NAME, id));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const row = await getDocument(id);
  if (!row) {
    redirect("/");
  }

  return (
    <div className={"flex justify-center"}>
      <SignedOut>
        <div
          className={
            "prose prose-base prose-invert mx-8 my-4 prose-headings:mb-4 prose-p:mb-2 prose-p:mt-0"
          }
          dangerouslySetInnerHTML={{ __html: row.content }}
        />
      </SignedOut>
      <SignedIn>
        <Editor content={row.content} id={id} />
      </SignedIn>
    </div>
  );
}
