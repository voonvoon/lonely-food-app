"use Client";

import {
  createCategoryAction,
  fetchCategoriesAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/actions/categories";

import { createContext, useState, useContext, ReactNode } from "react";
import toast from "react-hot-toast";
import { Category } from "@/types-folder/types";

export const CategoryContext = createContext<any>(undefined); //<any> indicating the context can hold any type of value.

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({
  children,
}) => {
  //to create a category
  const [name, setName] = useState("");
  // for fetching all categories
  //const [categories, setCategories] = useState([]);
  const [categories, setCategories] = useState<any[]>([]); // Specify the type as any[]

  console.log(
    "see categories from useContext==========================>",
    categories
  );
  // for update and delete
  const [updatingCategory, setUpdatingCategory] = useState<any>(null);

  console.log("updatingCategory----------->", updatingCategory);

  const createCategory = async (categoryData: Category) => {
    try {
      const data = await createCategoryAction({ name: name });

      if (!data) {
        toast.error("Failed to create category");
      } else {
        toast.success("Category created🙂.");
        setName("");
        setCategories([data, ...categories]);
      }
    } catch (err:any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetchCategoriesAction();
      if (!response) {
        throw new Error("Response is null");
      }
      const data = response;

      if (!response) {
        toast.error(data);
      } else {
        setCategories(data);
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occureed. Try again please!");
    }
  };

  //   const fetchCategoriesPublic = async () => {
  //     try {
  //       const response = await fetch(`${process.env.API}/categories`);
  //       const data = await response.json();

  //       if (!response.ok) {
  //         toast.error(data);
  //       } else {
  //         setCategories(data);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       toast.error("An error occureed. Try again please!");
  //     }
  //   };

  const updateCategory = async () => {
    try {
      const response = await updateCategoryAction(
       { id:updatingCategory?.id , name: updatingCategory?.name }
      );

      const data = response;
      if (!response) {
        toast.error(data);
      } else {
        toast.success("Category updated 😎!");
        setUpdatingCategory(null);
        //tis can avoid create another api func
        //tis update ui by check: if existing item in the [] matches updatingCategory' item ?
        //if yes then set that item to data(updated) else use orignal which is 'category'
        setCategories(
          categories.map((category) =>
            category.id === updatingCategory.id ? data : category
          )
        );
        setUpdatingCategory(null); // after done clear state.
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occureed. Try again please!");
    }
  };

  const deleteCategory = async () => {
    try {
      const response = await deleteCategoryAction(updatingCategory?.id);

      const data = response;

      if (!response) {
        toast.error(data);
      } else {
        toast.success("Category deleted!");
        //update ui
        setCategories(
          categories.filter((category) => category.id !== updatingCategory.id)
        );
        setUpdatingCategory(null); // clear state
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occureed. Try again please!");
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        name,
        setName,
        categories,
        setCategories,
        updatingCategory,
        setUpdatingCategory,
        createCategory,
        fetchCategories,
        deleteCategory,
        updateCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
