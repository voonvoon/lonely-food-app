"use server";

import { db } from "@/db";


 export async function createTestTables() {
const generateRandomString = (length: number) =>
    Math.random().toString(36).substring(2, 2 + length);

const tables = Array.from({ length: 10 }, (_, i) => ({
    table: i + 1,
    tableId: generateRandomString(5),
    checkinId: "",
    tableActive: false,
}));

  await db.tableActive.createMany({
    data: tables,
  });

  return { success: true };
}