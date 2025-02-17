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

export async function getOrders(page: number, limit: number = 10) {
    try {
        const orders = await db.order.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
        return orders;
    } catch (error) {
        console.error("Error retrieving orders:", error);
        throw new Error("Could not retrieve orders");
    }
}

export async function deleteOrderById(orderId: string) {
    try {
        await db.order.delete({
            where: { orderid: orderId },
        });
        return { message: "Order deleted successfully" };
    } catch (error) {
        console.error("Error deleting order:", error);
        throw new Error("Could not delete order");
    }
}

