"use client";

import { useSubCategory } from "@/context/subCategories";
import { useEffect } from "react";

export default function SubCategoryList() {
  const {
    fetchSubCategories,
    subCats,
    setUpdatingCat,
    //updatingCat,
    //parentCategory,
  } = useSubCategory();

  useEffect(() => {
    fetchSubCategories();
  }, []);

  return (
    <div className="my-5">
      {subCats?.map((c: any) => (
        <button
          key={c.id}
          className="px-4 py-2 m-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
          onClick={() => setUpdatingCat(c)}
        >
          {c.name}
        </button>
      ))}

      
      {/* {updatingCat && (
        <>
          <pre className="mt-4 p-2 bg-gray-100 rounded">
            subCats:
            {JSON.stringify(subCats, null, 2)}
          </pre>
          <pre className="mt-4 p-2 bg-gray-100 rounded">
            updatingCat:
            {JSON.stringify(updatingCat, null, 2)}
          </pre>

          <pre className="mt-4 p-2 bg-gray-100 rounded">
            parentCategory:
            {JSON.stringify(parentCategory, null, 2)}
          </pre>
        </>
      )} */}
    </div>
  );
}
