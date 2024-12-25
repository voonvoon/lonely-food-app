"use Client";

import {
  createSubCategoryAction,
  deleteSubCategoryAction,
  getSubCategoriesAction,
  updateSubCategoryAction,
} from "@/actions/subCategories";

import { createContext, useState, useContext, ReactNode } from "react";
import toast from "react-hot-toast";

export const SubCategoryContext = createContext<any>(undefined); //<any> indicating the context can hold any type of value.

interface SubCategoryProviderProps {
  children: ReactNode;
}

export const SubCategoryProvider: React.FC<SubCategoryProviderProps> = ({
  children,
}) => {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState(""); // admin selected parent category to create subCategory
  const [subCats, setSubCats] = useState<any[]>([]);
  const [updatingCat, setUpdatingCat] = useState<any>(null); // user selected existing tag
  const [refresh, setRefresh] = useState(false); // added by me to refresh show taglist after create/update

  const createSubCategory = async () => {
    try {
      const data = await createSubCategoryAction({
        name: name,
        slug: "",
        parentCategory: parentCategory,
      });

      if (!data) {
        toast.error("Failed to create category");
      } else {
        toast.success("Category created🙂.");
        setName("");
        setParentCategory("");
        //setParentCategory(data.id); //myself added
        //ui
        setSubCats([data, ...subCats]);
        setRefresh(!refresh);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  //fetch all subCategories
  const fetchSubCategories = async () => {
    try {
      const data = await getSubCategoriesAction();
      if (!data) {
        toast.error("Failed to fetch subCategories");
      } else {
        setSubCats(data);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  //delete a subCategory
  const deleteSubCategory = async () => {
    try {
      const data = await deleteSubCategoryAction(updatingCat.id);
      if (!data) {
        toast.error("Failed to delete subCategory");
      } else {
        toast.success("SubCategory deleted🙂.");
        setSubCats(subCats.filter((c) => c.id !== updatingCat.id)); //filter out the deleted subCategory
        setUpdatingCat(null);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  //update a subCategory
  const updateSubCategory = async () => {
    try {
      const data = await updateSubCategoryAction({
        id: updatingCat.id,
        name: updatingCat.name,
        slug: "",
        parentCategory: updatingCat.parentCategory,
      });

      if (!data) {
        toast.error("Failed to update subCategory");
      } else {
        toast.success("SubCategory updated🙂.");
        setSubCats(subCats.map((c) => (c.id === updatingCat.id ? data : c))); //update the just updated subCategory in the list
        setUpdatingCat(null);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <SubCategoryContext.Provider
      value={{
        name,
        setName,
        parentCategory,
        setParentCategory,
        subCats,
        setSubCats,
        updatingCat,
        setUpdatingCat,
        refresh,
        createSubCategory,
        fetchSubCategories,
        deleteSubCategory,
        updateSubCategory,
      }}
    >
      {children}
    </SubCategoryContext.Provider>
  );
};

export const useSubCategory = () => useContext(SubCategoryContext);
