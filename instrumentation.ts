import * as Sentry from "@sentry/nextjs";
import { connectionPool, DOCUMENTS_NAME, FOLDERS_NAME } from "@/lib/surrealdb";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }

  await connectionPool.initialize();
  const db = await connectionPool.acquire();
  try {
    const migrationQueries = `
    DEFINE TABLE IF NOT EXISTS ${FOLDERS_NAME} SCHEMAFULL;
    DEFINE FIELD IF NOT EXISTS name ON TABLE ${FOLDERS_NAME} TYPE string;
    DEFINE FIELD IF NOT EXISTS createdAt ON TABLE ${FOLDERS_NAME} TYPE datetime DEFAULT time::now() READONLY;
    
    DEFINE TABLE IF NOT EXISTS ${DOCUMENTS_NAME} SCHEMAFULL;
    DEFINE FIELD IF NOT EXISTS name ON TABLE ${DOCUMENTS_NAME} TYPE string;
    DEFINE FIELD IF NOT EXISTS content ON TABLE ${DOCUMENTS_NAME} TYPE string;
    DEFINE FIELD IF NOT EXISTS createdAt ON TABLE ${DOCUMENTS_NAME} TYPE datetime DEFAULT time::now() READONLY;
  `;
    await db.query(migrationQueries);
  } finally {
    connectionPool.release(db);
  }
}

export const onRequestError = Sentry.captureRequestError;
