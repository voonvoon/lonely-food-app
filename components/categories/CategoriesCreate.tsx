"use client";

import { useCategory } from "@/context/categories";

export default function CategoryCreate() {
  //context

  const {
    name,
    setName,
    updateCategory,
    updatingCategory,
    setUpdatingCategory,
    createCategory,
    deleteCategory,
  } = useCategory();

  return (
    <div className="my-5">
      <input
        type="text"
        value={updatingCategory ? updatingCategory?.name : name} // 1 form use to create/ update
        onChange={(e) =>
          updatingCategory
            ? setUpdatingCategory({ ...updatingCategory, name: e.target.value })
            : setName(e.target.value)
        }
        className="border border-gray-300 p-2 rounded w-full"
        placeholder="Category Name"
      />
      <div className="flex justify-between mt-4">
        <button
          //onClick={createCategory}
          onClick={updatingCategory ? updateCategory : createCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {updatingCategory ? "Update Category" : "Create Category"}
        </button>
        {updatingCategory && (
          <button
            onClick={deleteCategory}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Category
          </button>
        )}
      </div>
    </div>
  );
}
