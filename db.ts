import { PrismaClient } from "@prisma/client";
import { decl } from "postcss";

declare global {
    var prisma: PrismaClient | undefined;
}

export const db = global.prisma || new PrismaClient();