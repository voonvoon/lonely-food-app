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
  // return (
  //   <div className="container mx-auto px-4 py-6 ">
  //     <div className="bg-white shadow-md rounded-lg min-h-screen flex flex-col">
  //       <h1 className="text-xl font-semibold mb-4  text-center">Main menu</h1>
  //       <hr className="border-gray-300 my-4 mb-12" />
  //       <div
  //         className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 overflow-y-auto "
  //         style={{ maxHeight: "calc(100vh - 50px)" }}
  //       >
  //         {/* {Array.from({ length: 15 }).map((_, index) => (
  //           <Skeleton key={index} height={250} width={250} />
  //         ))} */}

  //         {items.length === 0 ? (
  //           Array.from({ length: 15 }).map((_, index) => (
  //             <Skeleton key={index} height={250} width={250} />
  //           ))
  //         ) : (
  //           items.map((item: any) => (
  //             <ItemCard
  //               key={item.id}
  //               images={item.images}
  //               title={item.title}
  //               description={item.description}
  //             />
  //           ))
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="bg-white shadow-md rounded-lg min-h-screen flex flex-col">
      <h1 className="text-lg font-semibold mt-3 mb-2 text-center underline">
        Main menu
      </h1>
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
            <h2 className="text-2xl text-center p-2 rounded-md bg-red-200">
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
                      <h3 className="text-md mb-2 mt-4 w-full border-b-2 border-gray-200 pb-1">
                        {subCategory.subCategoryName}
                      </h3>
                      <div className="flex flex-wrap gap-2 w-full">
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

//old code
// const categoryOrder = [
//   "Starter",
//   "Main Course",
//   "Seafood Haven",
//   "Side Dishes",
//   "Desserts",
//   "Drinks",
//   "Snack",
// ];
// const itemsByCategory = categories
//   .map((category: { id: any; name: string }) => ({
//     ...category,
//     items: items.filter(
//       (item: any) => item.category === category.id
//     ),
//   }))
//   .sort((a: any, b: any) => {
//     const indexA = categoryOrder.indexOf(a.name); // Find position of 'a' in the order list
//     const indexB = categoryOrder.indexOf(b.name); // Find position of 'b' in the order list
//     if (indexA === -1) return 1; // If 'a' is not in the order list, put it at the end
//     if (indexB === -1) return -1; // If 'b' is not in the order list, put it at the end
//     return indexA - indexB; // Otherwise, sort based on their positions

//     //let's say starter, it index is 0, main course is 1--> 0 - 1 = -1
//     // A negative result (-1) tells the sorting algorithm that "Starter" should come before "Main Course".
//   });

// console.log(
//   "itemsByCategory----------------------------------->>",
//   itemsByCategory
// );

// //Further group items by sub-category within each category
// const itemsBySubCategory = itemsByCategory.map((category: any) => {
//   // Map items to sub-categories and group them by sub-category id (subCategory) in an object (itemsBySubCategory2) using reduce.
//   const groupedItemsBySubCategory = category.items
//     .map((item: any) => ({
//       ...item,
//       subCategoryName: item.newSubCategory[0]?.name || "Uncategorized",
//       subCategory: item.newSubCategory[0]?.id || "Uncategorized", // Take the first sub-category or default to "Uncategorized"
//     }))
//     // Reduce function is used to group the items by their subCategory.
//     // Initializes an accumulator object (acc) as empty {}.
//     // For each item, it checks if the subCategory already exists as a key in the acc. If not, it initializes an array for that sub-category. It then pushes the item into the array corresponding to its subCategory.
//     .reduce((acc: any, item: any) => {
//       if (!acc[item.subCategory]) {
//         acc[item.subCategory] = [];
//       }
//       acc[item.subCategory].push(item);
//       return acc;
//     }, {});

//   //output {'subCatId': [{item1}, {item2}, {item3}]}
//   console.log(
//     "groupedItemsBySubCategory----------------------------------->>",
//     groupedItemsBySubCategory
//   );

//   const getKeySubCategories = Object.keys(groupedItemsBySubCategory);

//   //output:['676ba0b0a83ead9eeac62232', '676bac46a83ead9eeac62292']
//   console.log(
//     "getKeySubCategories----------------------------------->>",
//     getKeySubCategories
//   );

//   return {
//     ...category,
//     itemsBySubCategory: getKeySubCategories.map((subCategory) => ({
//       subCategory,
//       subCategoryName:
//         groupedItemsBySubCategory[subCategory][0]?.subCategoryName ||
//         "Uncategorized",
//       items: groupedItemsBySubCategory[subCategory],
//     })),
//   };
// });

// console.log(
//   "itemsBySubCategory----------------------------------->>",
//   itemsBySubCategory
// );
