"use server";

import { getDb } from "@/lib/surrealdb";

export default async function Home() {
  getDb();

  return <main></main>;
}
