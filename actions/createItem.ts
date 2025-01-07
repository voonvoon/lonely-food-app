"use server";

import { db } from "@/db";

//create a new item
export const createItemAction = async (data: any) => {
  try {
    // Ensure no duplicates in subCategory array before saving
    // const uniqueSubCategories: string[] = [
    //   ...new Set(data.subCategory as string[]), // new Set(...): Creates a new Set object, which is a collection of unique values.
    // ];

    //ensure name is not empty
    if (!data.title.trim()) {
      throw new Error("Item title cannot be empty");
    }
    if (!data.description.trim()) {
      throw new Error("Item description cannot be empty");
    }
    if (data.price == null || isNaN(data.price)) {
      throw new Error("Item price must be a valid number");
    }
    if (!data.category) {
      throw new Error("must select a category.");
    }

    const item = await db.item.create({
      data: {
        title: data.title.trim(),
        slug: data.title.toLowerCase().replace(/\s+/g, "-"),
        description: data.description,
        price: data.price,
        available: data.available ?? true,
        category: data.category,
        newSubCategory: data.newSubCategory,
        images: data.images,
      },
    });
    return item;
  } catch (error: any) {
    throw new Error(error.message);
  } finally {
    await db.$disconnect();
  }
};

//fetch all items
export const fetchItemsAction = async () => {
  try {
    const items = await db.item.findMany({
      include: {
        categoryRef: true,
        //subCategory:true
        //subCategoryRef: true,
      },
    });
    return items;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await db.$disconnect();
  }
};

//update item
export const updateItemAction = async (data: any) => {
  try {
    // Ensure no duplicates in subCategory array before saving
    const uniqueSubCategories: string[] = [
      ...new Set(data.subCategory as string[]),
    ];

    //ensure name is not empty
    if (!data.title.trim()) {
      throw new Error("Item title cannot be empty");
    }
    if (!data.description.trim()) {
      throw new Error("Item description cannot be empty");
    }
    if (data.price == null || isNaN(data.price)) {
      throw new Error("Item price must be a valid number");
    }
    if (!data.category) {
      throw new Error("must select a category.");
    }

    const item = await db.item.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title.trim(),
        slug: data.title.toLowerCase().replace(/\s+/g, "-"),
        description: data.description,
        price: data.price,
        available: data.available ?? true,
        category: data.category,
        newSubCategory: data.newSubCategory,
        images: data.images,
      },
    });
    return item;
  } catch (error: any) {
    throw new Error(error.message);
  } finally {
    await db.$disconnect();
  }
};
export const testing123 = async () => {
  try {
    const items = await db.test_one.findMany({
      include: {
        test: true,
      },
    });
    return items;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export async function uploadImage(base64ImageData: string, imageName: string) {
  try {
    const image = await db.image.create({
      data: {
        name: imageName,
        //convert the base64-encoded image data into a binary buffer (string --> binary)
        data: Buffer.from(base64ImageData, "base64"),
      },
    });
    return { success: true, image };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return { success: false, error: error.message };
  } finally {
    await db.$disconnect();
  }
}

//delete image
export const deleteImageAction = async (imageId: string) => {

  try {
    const deletedImage = await db.image.delete({
      where: {
        id: imageId,
      },
    });
    return { success: true, deletedImage };
  } catch (error: any) {
    console.error("Error deleting image:", error);
    return { success: false, error: error.message };
  } finally {
    await db.$disconnect();
  }
};

//fetch single item
export const fetchSingleItemAction = async (id: string) => {
  try {
    const item = await db.item.findUnique({
      where: {
        id,
      },
      include: {
        categoryRef: true,
        //subCategoryRef: true,
      },
    });
    return item;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await db.$disconnect();
  }
};

//delete item
export const deleteItemAction = async (id: string) => {
  try {
    // Retrieve the item to get the image IDs
    const item = await db.item.findUnique({
      where: {
        id,
      },
    });

    if (!item) {
      throw new Error("Item not found");
    }

    // Extract image IDs
    const imageIds = Array.isArray(item.images)
      ? item.images.map((image: any) => image.id)
      : [];

    // Delete all images associated with the item
    await Promise.all(
      imageIds.map(async (imageId: string) => {
        await db.image.delete({
          where: {
            id: imageId,
          },
        });
      })
    );

    // Delete the item
    const deletedItem = await db.item.delete({
      where: {
        id,
      },
    });

    return deletedItem;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await db.$disconnect();
  }
};
