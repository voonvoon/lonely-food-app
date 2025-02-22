"use client";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useContext } from "react";
import { MenuContext } from "@/context/menu";
import ItemCard from "@/components/items/ItemCard";
import Link from "next/link";


export default function MenuPage() {
  const { fetchAllItem, categories } = useContext(MenuContext);
  const [items, setItems] = useState([]) as any;


  useEffect(() => {
    const fetchData = async () => {
      const allItems = await fetchAllItem();
      setItems(allItems);
      console.log(
        "fetchAllItems----------------------------------->>",
        allItems
      );
    };

    fetchData();
  }, []);

  // Group items by category
  // If a category name is not found in categoryOrder, it is placed at the end of the list.
  //The sorting part works by comparing the indices of category names in the categoryOrder array.
  //This ensures that the categories are ordered according to the predefined sequence in categoryOrder.
  //If a category name is not found in categoryOrder, it is placed at the end of the list.

  const categoryOrder = [
    "Starter",
    "Main Course",
    "Seafood Haven",
    "Side Dishes",
    "Desserts",
    "Drinks",
    "Snack",
  ];

  const itemsBySubCategory = categories
    .map((category: { id: any; name: string }) => ({
      ...category,
      items: items.filter((item: any) => item.category === category.id),
    }))
    .sort((a: any, b: any) => {
      const indexA = categoryOrder.indexOf(a.name);
      const indexB = categoryOrder.indexOf(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    })
    //at this stage, we have grouped items by category
    //Now we need to group items by sub-category within each category
    .map((category: any) => {
      //now category is the grouped items by category not the original category
      const groupedItemsBySubCategory = category.items
        .map((item: any) => ({
          ...item,
          subCategoryName: item.newSubCategory[0]?.name || "Uncategorized",
          subCategory: item.newSubCategory[0]?.id || "Uncategorized",
        }))
        .reduce((acc: any, item: any) => {
          if (!acc[item.subCategory]) {
            acc[item.subCategory] = [];
          }
          acc[item.subCategory].push(item);
          return acc;
        }, {});

      //now the output will looks like: {'subCatId': [{item1}, {item2}, {item3}]

      //get the keys of the groupedItemsBySubCategory for distribution process
      //output:['676ba0b0a83ead9eeac62232', '676bac46a83...
      const getKeySubCategories = Object.keys(groupedItemsBySubCategory);
      //console.log("groupedItemsBySubCategory----------------------------------->>", groupedItemsBySubCategory);

      return {
        ...category,
        itemsBySubCategory: getKeySubCategories.map((subCategory) => ({
          subCategory, //subCategory is the id of the subCategory
          subCategoryName:
            groupedItemsBySubCategory[subCategory][0]?.subCategoryName ||
            "Uncategorized",
          items: groupedItemsBySubCategory[subCategory],
        })),
      };
    });

  console.log(
    "itemsByCategoryAndSubCategory----------------------------------->>",
    itemsBySubCategory
  );
  

  return (
    <div className="bg-white shadow-md rounded-lg min-h-screen flex flex-col">
      {/* <h1 className="text-lg font-semibold mt-3 mb-2 text-center underline">
        Main menu
      </h1> */}
      {/* <hr className="border-gray-300 my-4 mb-12" /> */}
      <div
        //grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 overflow-y-auto
        className="flex-grow overflow-y-auto gap-2 px-4 py-8"
        style={{ maxHeight: "calc(100vh - 50px)" }}
      >
        {items.length === 0 ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 15 }).map((_, index) => (
              <Skeleton key={index} height={250} width={250} />
            ))}
          </div>
        ) : null}
        {itemsBySubCategory.map((category: any) => (
          <div key={category.id} id={category.name}>
            <h2 className="text-2xl text-center p-2 mt-2 rounded-md bg-gray-100">
              {category.items.length === 0 ? "" : category.name}
            </h2>
            <div className="flex flex-col gap-2">
              {category.items.length === 0
                ? ""
                : category.itemsBySubCategory.map((subCategory: any) => (
                    <div
                      key={subCategory.subCategory}
                      id={subCategory.subCategoryName}
                      className="w-full"
                    >
                      <h3 className="text-md mb-2 mt-4 w-full border-b-2 border-gray-100 pb-1">
                        {subCategory.subCategoryName}
                      </h3>
                      <div className=" gap-2 w-full grid grid-cols-2 sm:flex sm:flex-wrap">
                        {subCategory.items.map((item: any) => (
                           <Link href={`/item-page?id=${item.id}`} key={item.id}>
                            <ItemCard
                              key={item.id}
                              images={item.images}
                              title={item.title}
                              description={item.description}
                              price={item.price}
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


