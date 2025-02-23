"use client";

import { JSX, useEffect, useState, useRef } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useContext } from "react";
import { MenuContext } from "@/context/menu";
import { SubCategoryContext } from "@/context/subCategories";
import { FaBeer, FaPizzaSlice } from "react-icons/fa";
import { FaBowlFood } from "react-icons/fa6";
import { LuDessert } from "react-icons/lu";
import { TbEggFried } from "react-icons/tb";
import { GiPotato } from "react-icons/gi";
import { FaFishFins } from "react-icons/fa6";

const MenuNavbar: React.FC = () => {
  const [clickedCategory, setClickedCategory] = useState<string>("");

  const {
    fetchAllCategory,
    categories,
    setCategories,
    activeSubCategory,
    activeCategory,
  } = useContext(MenuContext);

  const { fetchSubCategories, subCats } = useContext(SubCategoryContext);

  //const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const fetchData = async () => {
      const allCategories = await fetchAllCategory();
      setCategories(allCategories);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSubCats = async () => {
      await fetchSubCategories();
    };

    fetchSubCats();
  }, []);

  // Mapping of categories to icons
  const categoryIcons: { [key: string]: JSX.Element } = {
    drinks: <FaBeer />,
    starter: <FaPizzaSlice />,
    desserts: <LuDessert />,
    snack: <GiPotato />,
    "main-course": <FaBowlFood />,
    "side-dishes": <TbEggFried />,
    "seafood-haven": <FaFishFins />,
    // Add more mappings as needed
  };

  const handleScrollToCategory = (category: string) => {
    const categoryElement = document.getElementById(category);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToSubCategory = (subCategory: string) => {
    const categoryElement = document.getElementById(subCategory);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  //order the categories
  const orderedCategories = categories.sort((a: any, b: any) => {
    const categoryOrder = [
      "starter",
      "main-course",
      "seafood-haven",
      "side-dishes",
      "desserts",
      "drinks",
      "snack",
    ];

    return categoryOrder.indexOf(a.slug) - categoryOrder.indexOf(b.slug);
  });

  return (
    <div className="container mx-auto">
      <ul className="bg-white shadow-md rounded-lg flex flex-col space-y-2 cursor-pointer ">
        <div
          className="flex flex-col md:grid-cols-4 gap-1 overflow-y-auto px-12 py-12 min-h-screen"
          style={{ maxHeight: "calc(100vh - 50px)" }}
        >
          {orderedCategories.length > 0 ? (
            orderedCategories.map((category: any, index: any) => (
              <div key={index}>
                <li
                  className={`hover:text-yellow-500 text-lg px-2 ${
                    activeCategory === category.id ? "text-yellow-500" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col md:flex-row items-center justify-center p-2 space-x-2">
                      <div>{categoryIcons[category.slug]}</div>
                      <span className="text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis sm:text-lg">
                        <button
                          key={category.name}
                          onClick={() => {
                            handleScrollToCategory(category.name);
                            setClickedCategory(category.id);
                          }}
                        >
                          {category.name}
                        </button>
                      </span>
                    </div>
                  </div>
                </li>
                <div className="flex flex-col items-center justify-center">
                  {clickedCategory === category.id &&
                    subCats
                      .filter(
                        (subCat: any) =>
                          subCat.parentCategory === clickedCategory
                      )
                      .map((filteredSubCat: any, subIndex: any) => (
                        <ul
                          key={subIndex}
                          className="mt-3 font-extralight text-sm list-inside flex justify-center"
                          style={{
                            animation: `fadeIn 0.9s ease-in-out ${
                              subIndex * 0.1
                            }s forwards`,
                            opacity: 0,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <li
                            className={`hover:text-yellow-500 transition-transform duration-300 ease-in-out transform hover:scale-105 ${
                              activeSubCategory === filteredSubCat.id
                                ? "text-yellow-500"
                                : ""
                            }`}
                            onClick={() =>
                              handleScrollToSubCategory(filteredSubCat.name)
                            }
                          >
                            {filteredSubCat.name}
                          </li>
                        </ul>
                      ))}
                  <style jsx>{`
                    @keyframes fadeIn {
                      to {
                        opacity: 1;
                      }
                    }
                  `}</style>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <Skeleton count={10} height={40} width={70} />
            </div>
          )}
        </div>
      </ul>
    </div>
  );
};

export default MenuNavbar;
