import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Database } from "../config/prisma";

class PostController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new Database().getInstance();
  }
}

export default PostController;
