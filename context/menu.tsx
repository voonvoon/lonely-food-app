"use Client";
import { createContext, useState, useContext, ReactNode } from "react";
import {
  fetchAllItemAction,
  fetchAllCategoryAction,
  fetchSingleItemAction,
} from "@/actions/item";
import toast from "react-hot-toast";

export const MenuContext = createContext<any>(undefined); //<any> indicating the context can hold any type of value.

interface MenuProviderProps {
  children: ReactNode;
}
export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState([]) as any;

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("");

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

  //fetch single item by id
  const fetchSingleItem = async (id: string) => {
    try {
      const response = await fetchSingleItemAction(id);
      if (!response) {
        throw new Error("Failed to fetch item");
      }
      return response;
    } catch (error) {
      console.error("Error fetching item:", error);
      throw new Error("Could not fetch item");
    }
  };

  return (
    <MenuContext.Provider
      value={{
        fetchAllItem,
        fetchAllCategory,
        categories,
        setCategories,
        fetchSingleItem,
        activeCategory,
        setActiveCategory,
        activeSubCategory,
        setActiveSubCategory,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useCategory = () => useContext(MenuContext);
