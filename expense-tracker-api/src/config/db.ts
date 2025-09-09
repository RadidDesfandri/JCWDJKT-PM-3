import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    });
  }

  public async connect() {
    try {
      const client = await this.pool.connect();
      console.log("Database connected!");

      client.release();
    } catch (error) {
      console.error("Database connection failed", error);
      process.exit(1);
    }
  }

  public getPool(): Pool {
    return this.pool;
  }
}

export const db = new Database();
