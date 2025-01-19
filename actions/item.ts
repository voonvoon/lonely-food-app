"use server";

import { db } from "@/db";

//fetch all item
export async function fetchAllItemAction() {
    try {
        return await db.item.findMany();
    } catch (error) {
        console.error("Error fetching items:", error);
        throw new Error("Could not fetch items");
    }
}

//fetch all category
export async function fetchAllCategoryAction() {
    try {
        return await db.category.findMany();
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Could not fetch categories");
    }
}
