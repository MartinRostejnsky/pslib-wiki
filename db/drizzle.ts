import {drizzle} from "drizzle-orm/neon-http";
import * as schema from './schema';

let url = process.env.DATABASE_URL;
if (!url) {
    console.error("No DATABASE_URL");
    url = "";
}

export const db = drizzle(url, {schema});