"use Client";
import { createContext, useState, useContext, ReactNode } from "react";
import { fetchAllItemAction, fetchAllCategoryAction } from "@/actions/item";
import toast from "react-hot-toast";

export const MenuContext = createContext<any>(undefined); //<any> indicating the context can hold any type of value.

interface MenuProviderProps {
  children: ReactNode;
}
export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState([]) as any;

  console.log("categories------------------------------------>", categories);
  //fetch all item
  const fetchAllItem = async () => {
    try {
      const response = await fetchAllItemAction();
      if (!response) {
        throw new Error("Failed to fetch items");
      }
      return response;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw new Error("Could not fetch items");
    }
  };

  //fetch all category
  const fetchAllCategory = async () => {
    try {
      const response = await fetchAllCategoryAction();
      if (!response) {
        throw new Error("Failed to fetch categories");
      }
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Could not fetch categories");
    }
  };

  return (
    <MenuContext.Provider
      value={{
        fetchAllItem,
        fetchAllCategory,
        categories,
        setCategories,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useCategory = () => useContext(MenuContext);
