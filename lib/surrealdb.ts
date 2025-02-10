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

class MockSurreal {
  async connect(url: string) {
    console.log("MockSurreal: Pretending to connect to", url);
  }

  get ready(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async signin(credentials: { username: string; password: string }) {
    console.log("MockSurreal: Pretending to sign in", credentials);
  }

  async use(options: { namespace: string; database: string }) {
    console.log("MockSurreal: Pretending to use", options);
  }

  async query(query: string, params: string[]) {
    console.log("MockSurreal: Querying a database: ", query, params);
  }

  async close() {
    console.log("MockSurreal: Pretending to close connection");
  }
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
    // if DB_URL is undefined, create a mock connection instead of throwing an error
    if (!process.env.DB_URL) {
      console.warn("No DB_URL set in environment; using a mock connection.");
      return this.createMockConnection();
    }

    const db = new Surreal();

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

  private async createMockConnection(): Promise<Surreal> {
    const mockDb = new MockSurreal();
    await mockDb.connect("mock://url");

    if (process.env.DB_USER && process.env.DB_PASSWORD) {
      await mockDb.signin({
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });
    }

    await mockDb.use({
      namespace: process.env.DB_NAMESPACE || "default_namespace",
      database: process.env.DB_DATABASE || "default_database",
    });

    // Cast the mock as Surreal for compatibility with the rest of the pool.
    return mockDb as unknown as Surreal;
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
export const COLLECTIONS_NAME = "collections";
