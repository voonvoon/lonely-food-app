"use client";

import { JSX, useEffect, useState } from "react";
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

  const { fetchAllCategory, categories, setCategories } =
    useContext(MenuContext);

  const { fetchSubCategories, subCats } = useContext(SubCategoryContext);

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
        {/* <h1 className="text-lg font-semibold mt-3 mb-3 text-center underline">
          Categories
        </h1> */}
        {/* <hr className="border-gray-300 my-4 mb-12" /> */}
        <div
          className="flex flex-col md:grid-cols-4 gap-1 overflow-y-auto px-12 py-12 min-h-screen"
          style={{ maxHeight: "calc(100vh - 50px)" }}
        >
          {orderedCategories.length > 0 ? (
            orderedCategories.map((category: any, index: any) => (
              <div key={index}>
                <li className="hover:text-yellow-500 text-lg px-2">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-start p-2 space-x-2">
                      <span className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis sm:text-lg">
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

                      <div>{categoryIcons[category.slug]}</div>
                    </div>
                  </div>
                </li>
                <div className="flex flex-col items-center">
                  {clickedCategory === category.id &&
                    subCats
                      .filter(
                        (subCat: any) =>
                          subCat.parentCategory === clickedCategory
                      )
                      .map((filteredSubCat: any, subIndex: any) => (
                        <ul
                          key={subIndex}
                          className="mt-2 font-extralight text-xs list-inside"
                          style={{
                            animation: `fadeIn 0.9s ease-in-out ${
                              subIndex * 0.1
                            }s forwards`,
                            opacity: 0,
                          }}
                        >
                          <li
                            className="hover:text-yellow-500 transition-transform duration-300 ease-in-out transform hover:scale-105"
                            onClick={() =>
                              handleScrollToSubCategory(filteredSubCat.name)
                            }
                          >
                            {filteredSubCat.name}
                          </li>
                        </ul>
                      ))}
                  {/* <style jsx>: This tag is used to write scoped CSS styles within a React component. */}
                  <style jsx>{`
                    @keyframes fadeIn {
                      to {
                        opacity: 1;
                      }
                    }
                  `}</style>
                  {/* to { opacity: 1; }:final state of the animation. When completes, the element's opacity will be 1 */}
                </div>
              </div>
            ))
          ) : (
            <Skeleton count={8} height={40} />
          )}
        </div>
      </ul>
    </div>
  );
};

export default MenuNavbar;
