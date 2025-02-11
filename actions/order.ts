"use server";

import { db } from "@/db";

export async function getOrderById(orderId: string) {
    try {
        const order = await db.order.findUnique({
            where: { orderid: orderId },
        });
        return order;
    } catch (error) {
        console.error("Error retrieving order:", error);
        throw new Error("Could not retrieve order");
    }
}