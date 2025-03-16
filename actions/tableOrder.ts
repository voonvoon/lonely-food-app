"use server";

import { db } from "@/db";

export async function createTestTables() {
  const generateRandomString = (length: number) =>
    Math.random()
      .toString(36)
      .substring(2, 2 + length);

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

export async function createOrderForTable(
  orderItems: Record<
    string,
    { id: string; title: string; price: number; number: number }[]
  >,
  cardNo: string,
  tableNo: number,
  dineInUser: string
) {
  // Retrieve existing order
  const existingOrderForSameUser = await db.tableOrder.findFirst({
    where: {
      tableId: cardNo,
      tableNo,
      paid: false,
      dineInUser: {
        has: dineInUser, //cuz if same user order before, it will be in the dineInUser array
      },
    },
  });

  console.log("existingOrder------------->>", existingOrderForSameUser);

  // Retrieve existing order for different device/user who scan the same table QR later
  const existingOrderForDifferentUser = await db.tableOrder.findFirst({
    where: {
      tableId: cardNo, //same table
      tableNo, //same table
      paid: false, //haven't paid yet means still active.
      createdAt: {
        gte: new Date(Date.now() - 4 * 60 * 60 * 1000), // only retrieve orders created in the last 4 hours
        //gte: new Date(Date.now() - 5 * 60 * 1000), // only retrieve orders created in the last 5 minutes
      },
    },
  });

  console.log(
    "existingOrderForDifferentUser------------->>",
    existingOrderForDifferentUser
  );

  if (existingOrderForSameUser || existingOrderForDifferentUser) {
    const orderToUpdate =
      existingOrderForSameUser || existingOrderForDifferentUser;

    console.log("orderToUpdate------------->>", orderToUpdate);

    if (orderToUpdate) {
      // Push new orderItems to existing orderItems
      if (Array.isArray(orderToUpdate.orderItems)) {
        orderToUpdate.orderItems.push({ allOrders: orderItems, dineInUser });
      } else {
        orderToUpdate.orderItems = [{ allOrders: orderItems, dineInUser }];
      }

      // If existingOrderForDifferentUser exists, push dineInUser to dineInUser array
      if (
        existingOrderForDifferentUser &&
        !orderToUpdate.dineInUser.includes(dineInUser)
      ) {
        orderToUpdate.dineInUser.push(dineInUser);
      }

      // Update the existing order
      await db.tableOrder.update({
        where: {
          id: orderToUpdate.id,
        },
        data: {
          orderItems: orderToUpdate.orderItems,
          dineInUser: orderToUpdate.dineInUser,
        },
      });
    }

    return { success: true, message: "Order updated successfully" };
  } else {
    // Create a new order
    const orderData = {
      tableId: cardNo,
      tableNo,
      orderItems: [{ allOrders: orderItems, dineInUser }],
      totalAmount: 0, // Default total amount
      email: "default-email",
      dineInUser: [dineInUser],
      finalOrders: [], // Add this line to include the missing property
    };

    console.log("orderData------------->>", orderData);

    await db.tableOrder.create({
      data: orderData,
    });

    // Update the tableActive field to true for the matching table
    const updateTableActive = await db.tableActive.updateMany({
      where: {
        id: cardNo,
      },
      data: {
        tableActive: true,
      },
    });

    console.log("updateTableActive------------->>", updateTableActive);

    return { success: true, message: "Order created successfully" };
  }
}

export async function getAllTableActive() {
  const tables = await db.tableActive.findMany();
  return tables;
}

export async function getTableOrderById(tableId: string) {
  if (!tableId) {
    throw new Error("tableId is required");
  }

  const order = await db.tableOrder.findFirst({
    where: {
      tableId,
      paid: false,
    },
  });

  return order;
}

export async function summarizeAllOrderAndSave(tableId: string, finalOrders: { id: string; title: string; price: number; number: number }[], totalAmount: number) {
  if (!tableId) {
    throw new Error("tableId is required");
  }

  // Update the tableOrder to save the finalOrders
  const updateOrder = await db.tableOrder.updateMany({
    where: {
      tableId,
      paid: false,
    },
    data: {
      finalOrders,
      totalAmount,
    },
  });


  // Retrieve the updated order
  const updatedOrder = await db.tableOrder.findFirst({
    where: {
      tableId,
      paid: false,
    },
  });

  return updatedOrder;
}

export async function completeOrder(tableId: string) {
  // Update the tableOrder to mark it as paid
  const updateOrder = await db.tableOrder.updateMany({
    where: {
      tableId,
      paid: false,
    },
    data: {
      paid: true,
    },
  });

  console.log("updateOrder------------->>", updateOrder);

  // Update the tableActive field to false for the matching table
  const updateTableActive = await db.tableActive.updateMany({
    where: {
      id: tableId,
    },
    data: {
      tableActive: false,
    },  
  });

  console.log("updateTableActive------------->>", updateTableActive);

  return { success: true, message: "Order completed successfully" };
}

// New function to update finalOrders
export async function updateFinalOrders(orderId: string, updatedFinalOrders: { id: string; title: string; price: number; number: number }[]) {
  if (!orderId) {
    throw new Error("orderId is required");
  }

  // Update the finalOrders based on the new object parameter received
  const updateOrder = await db.tableOrder.update({
    where: {
      id: orderId,
    },
    data: {
      finalOrders: updatedFinalOrders,
    },
  });

  // return { success: true, message: "Order updated successfully" };

  // Retrieve the updated order
  const updatedOrder = await db.tableOrder.findFirst({
    where: {
      id: orderId,
    },
  });
  return { success: true, message: "Order updated successfully", updatedOrder };

  // return updatedOrder;
}
