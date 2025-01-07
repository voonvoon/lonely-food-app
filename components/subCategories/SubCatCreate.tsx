"use client";

import { useEffect } from "react";
import { useSubCategory } from "@/context/subCategories";
import { useCategory } from "@/context/categories";

export default function SubCatCreate() {
  //context
  const {
    name,
    setName,
    parentCategory,
    setParentCategory,
    updatingCat,
    setUpdatingCat,
    deleteSubCategory,
    updateSubCategory,
    createSubCategory,
    pending
  } = useSubCategory();

  const { fetchCategories, categories } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="my-5">
      <input
        type="text"
        value={updatingCat ? updatingCat?.name : name}
        onChange={(e) => {
          if (updatingCat) {
            setUpdatingCat({ ...updatingCat, name: e.target.value });
          } else {
            setName(e.target.value);
          }
        }}
        className="border border-gray-300 p-2 rounded w-full"
      />

      <div className="flex justify-between mt-4">
        <button
          disabled={pending}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={(e) => {
            e.preventDefault();
            updatingCat ? updateSubCategory() : createSubCategory();
          }}
        >
          {pending ? "Loading..." : updatingCat ? "Update" : "Create"}
        </button>

        {updatingCat && (
          <>
            <button
              className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600`}
              onClick={(e) => {
                e.preventDefault();
                deleteSubCategory();
              }}
            >
              {pending ? "Deleting..." : "Delete"}
            </button>

            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => setUpdatingCat(null)}
            >
              Clear
            </button>
          </>
        )}
      </div>
      <div className="mt-4">
        <label>Parent Category</label>
        <select
          name="category"
          className="border border-gray-300 p-2 rounded w-full"
          onChange={(e) =>
            updatingCat
              ? setUpdatingCat({
                  ...updatingCat,
                  parentCategory: e.target.value,
                })
              : setParentCategory(e.target.value)
          }
          value={updatingCat ? updatingCat.parentCategory : parentCategory}
        >
          <option>Select a category</option>
          {categories?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
