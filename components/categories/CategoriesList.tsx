"use client";

import { useEffect } from "react";
import { useCategory } from "@/context/categories";

export default function CategoryList() {
  const { fetchCategories, categories, setUpdatingCategory } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="my-5">
      {categories?.map((c: any) => (
        <button
          key={c.id}
          className="px-4 py-2 m-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
          onClick={() => setUpdatingCategory(c)}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
