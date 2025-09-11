import { PrismaClient } from "@prisma/client";

export class Database {
  private static instance: PrismaClient;

  public getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient();
      console.log("Connected to database");
    }

    return Database.instance;
  }
}
