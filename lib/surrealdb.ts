import Surreal from "surrealdb";
import { connection } from "next/server";

if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = WebSocket;
}

interface PooledConnection {
  db: Surreal;
  inUse: boolean;
  lastUsed: number;
}

class ConnectionPool {
  private pool: PooledConnection[] = [];
  private maxSize: number;
  private minSize: number;
  private idleTimeout: number; // in milliseconds
  private initialized = false;

  constructor(
    maxSize: number = 10,
    minSize: number = 2,
    idleTimeout: number = 30000,
  ) {
    this.maxSize = maxSize;
    this.minSize = minSize;
    this.idleTimeout = idleTimeout;
    this.startMaintenanceInterval();
  }

  private startMaintenanceInterval() {
    setInterval(() => this.performMaintenance(), 60000); // Run every minute
  }

  private async performMaintenance() {
    await connection();
    const now = Date.now();
    const connectionsToRemove: PooledConnection[] = [];

    // Only remove connections if we're above minSize
    if (this.pool.length > this.minSize) {
      this.pool.forEach((conn) => {
        if (
          !conn.inUse &&
          now - conn.lastUsed > this.idleTimeout &&
          this.pool.length > this.minSize
        ) {
          connectionsToRemove.push(conn);
        }
      });

      // Remove idle connections
      for (const conn of connectionsToRemove) {
        const index = this.pool.indexOf(conn);
        if (index !== -1) {
          await conn.db.close();
          this.pool.splice(index, 1);
        }
      }
    }
  }

  private async createConnection(): Promise<Surreal> {
    const db = new Surreal();

    if (!process.env.DB_URL) {
      throw new Error("No DB_URL set in environment");
    }

    await db.connect(process.env.DB_URL);
    await db.ready;

    if (process.env.DB_USER && process.env.DB_PASSWORD) {
      await db.signin({
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });
    }

    await db.use({
      namespace: process.env.DB_NAMESPACE,
      database: process.env.DB_DATABASE,
    });

    return db;
  }

  public async initialize() {
    if (this.initialized) return;

    // Create minimum connections
    for (let i = 0; i < this.minSize; i++) {
      const db = await this.createConnection();
      this.pool.push({
        db,
        inUse: false,
        lastUsed: Date.now(),
      });
    }

    this.initialized = true;
  }

  public async acquire(): Promise<Surreal> {
    if (!this.initialized) {
      await this.initialize();
    }

    // Find an available connection
    const availableConnection = this.pool.find((conn) => !conn.inUse);

    if (availableConnection) {
      availableConnection.inUse = true;
      availableConnection.lastUsed = Date.now();
      return availableConnection.db;
    }

    // Create new connection if pool isn't at max size
    if (this.pool.length < this.maxSize) {
      const db = await this.createConnection();
      const newConnection: PooledConnection = {
        db,
        inUse: true,
        lastUsed: Date.now(),
      };
      this.pool.push(newConnection);
      return db;
    }

    // Wait for a connection to become available
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const conn = this.pool.find((c) => !c.inUse);
        if (conn) {
          clearInterval(checkInterval);
          conn.inUse = true;
          conn.lastUsed = Date.now();
          resolve(conn.db);
        }
      }, 100);
    });
  }

  public release(db: Surreal) {
    const connection = this.pool.find((conn) => conn.db === db);
    if (connection) {
      connection.inUse = false;
      connection.lastUsed = Date.now();
    }
  }
}

export const connectionPool = new ConnectionPool();

export const DOCUMENTS_NAME = "documents";
export const FOLDERS_NAME = "folders";
export const FOLDER_CONTAINS_NAME = "folderContains";
