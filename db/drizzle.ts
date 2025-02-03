import {drizzle} from "drizzle-orm/neon-http";

let url = process.env.DATABASE_URL;
if (!url) {
    console.error("No DATABASE_URL");
    url = "";
}

export const db = drizzle(url);