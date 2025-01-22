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

//i forgot why i added this function, now i think i already have this in category.ts
//fetch all category
export async function fetchAllCategoryAction() {
    try {
        return await db.category.findMany();
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Could not fetch categories");
    }
}

//fetch single item by id
export async function fetchSingleItemAction(id: string) {
    try {
        return await db.item.findUnique({
            where: {
                id,
            },
        });
    } catch (error) {
        console.error("Error fetching item:", error);
        throw new Error("Could not fetch item");
    }
}
