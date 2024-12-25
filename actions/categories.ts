"use server";

import { db } from "@/db";
import { Category } from "@/types-folder/types";

//create a new category
export const createCategoryAction = async (data: Category) => {
  try {
    //ensure name is not empty
    if (!data.name.trim()) {
      //console.error("Category name cannot be empty");
      //return { error: "Category name cannot be empty" };
      throw new Error("Category name cannot be empty");
      //return null;
    }

    const category = await db.category.create({
      data: {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"), // generate slug from name
      },
    });
    return category;
  } catch (error:any) {
    console.error(error);
    throw new Error(error);
    //return null;
  }
};

//fetch all categories
export const fetchCategoriesAction = async () => {
  try {
    const categories = await db.category.findMany();
    return categories;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//delete a category
export const deleteCategoryAction = async (id: string) => {
  try {
    // Check if the category is used in subCategories, if yes, throw error and stop it
    const subCategories = await db.subCategory.findMany({
      where: {
        parentCategory: id,
      },
    });

    if (subCategories.length > 0) {
      throw new Error("Cannot delete as this is being used in sub categories, you need to delete sub categories first");
    }

    const category = await db.category.delete({
      where: {
        id,
      },
    });
    return category;
  } catch (error: any) {
    console.error(error);
    // throw new Error("Failed to delete category");
    throw new Error(error);
  }
};

//update a category
export const updateCategoryAction = async (data: Category) => {
  try {
    const category = await db.category.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"), // generate slug from name
      },
    });
    return category;
  } catch (error) {
    console.error(error);
    return null;
  }
};
