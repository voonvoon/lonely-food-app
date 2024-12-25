"use server";

import { db } from "@/db";
import { SubCategory } from "@/types-folder/types";

//create a new subCategory
export const createSubCategoryAction = async (data: SubCategory) => {
  try {
    //ensure name is not empty
    if (!data.name.trim()) {
      //console.error("SubCategory name cannot be empty");
      //return { error: "SubCategory name cannot be empty" };
      throw new Error("SubCategory name cannot be empty");
      //return null;
    }

    if (!data.parentCategory.trim()) {
      //console.error("SubCategory name cannot be empty");
      //return { error: "SubCategory name cannot be empty" };
      throw new Error("SubCategory' parentCategory cannot be empty");
      //return null;
    }

    const subCategory = await db.subCategory.create({
      data: {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"), // generate slug from name
        parentCategory: data.parentCategory,
      },
    });
    return subCategory;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
    //return null;
  }
};

//get all subCategories
export const getSubCategoriesAction = async () => {
  try {
    const subCategories = await db.subCategory.findMany();
    return subCategories;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//delete a subCategory
export const deleteSubCategoryAction = async (id: string) => {
  try {
    const subCategory = await db.subCategory.delete({
      where: {
        id,
      },
    });
    return subCategory;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//update a subCategory
export const updateSubCategoryAction = async (data: SubCategory) => {
  try {
    const subCategory = await db.subCategory.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"), // generate slug from name
        parentCategory: data.parentCategory,
      },
    });
    return subCategory;
  } catch (error) {
    console.error(error);
    return null;
  }
};
