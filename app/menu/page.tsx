"use client";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useContext } from "react";
import { MenuContext } from "@/context/menu";
import ItemCard from "@/components/items/ItemCard";
import Link from "next/link";
import { SubCategoryContext } from "@/context/subCategories";
import { throttle } from "lodash";

export default function MenuPage() {
  const { fetchAllItem, categories, setActiveSubCategory, setActiveCategory } =
    useContext(MenuContext);

  const { subCats } = useContext(SubCategoryContext);
  const [items, setItems] = useState([]) as any;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    //throttle so the func only called at most once every 200 ms.
    const handleScroll = throttle(() => {
      // If the scroll container ref is not set, return early.
      if (!scrollContainerRef.current) return;
      // Get the scroll position of the container element.
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      // Calculate the scroll position as the middle of the container.
      const scrollPosition = containerRect.top + containerRect.bottom / 2;

      let currentCategory = "";
      let currentSubCategory = "";

      for (const category of categories) {
        const categoryElement = document.getElementById(category.name);
        if (categoryElement) {
          const rect = categoryElement.getBoundingClientRect();

          if (rect.top <= scrollPosition && rect.bottom >= scrollPosition) {
            currentCategory = category.id;
            break;
          }
        }
      }

      for (const subCat of subCats) {
        const subCatElement = document.getElementById(subCat.name);
        if (subCatElement) {
          const rect = subCatElement.getBoundingClientRect();
          if (rect.top <= scrollPosition && rect.bottom >= scrollPosition) {
            currentSubCategory = subCat.id;
            break;
          }
        }
      }

      setActiveCategory(currentCategory);
      setActiveSubCategory(currentSubCategory);
    }, 200);

    const container = scrollContainerRef.current;
    if (container) {
      //calls the handleScroll function whenever the user scrolls within the container.
      container.addEventListener("scroll", handleScroll);
    }
    //Clean up the event listener
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [categories, subCats]);

  // Group items by category
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
    .map((category: any) => {
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

      const getKeySubCategories = Object.keys(groupedItemsBySubCategory);

      return {
        ...category,
        itemsBySubCategory: getKeySubCategories.map((subCategory) => ({
          subCategory,
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
      <div
        className="flex-grow overflow-y-auto gap-2 px-4 py-8"
        style={{ maxHeight: "calc(100vh - 50px)" }}
        ref={scrollContainerRef}
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
