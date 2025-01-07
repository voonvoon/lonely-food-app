"use client";

import { useCategory } from "@/context/categories";
import { useItem } from "@/context/createItem";
import { useSubCategory } from "@/context/subCategories";
import { useEffect, useState } from "react";
import { z } from "zod";
import Image from "next/image";


import { RiDeleteBin5Line } from "react-icons/ri";

const itemSchema = z.object({
  title: z
    .string()
    .min(1, "Name is required")
    .refine((val) => !/^\s|\s$/.test(val), "Title cannot begin or end with whitespace"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  newSubCategory: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .min(1, "At least one sub-category is required"),
});

export default function CreateItem() {
  const [errors, setErrors] = useState({}) as any;


  const {
    item,
    setItem,
    createProduct,
    updatingItem,
    setUpdatingItem,
    uploadImages,
    pending,
    setPending,
    deleteImage,
    uploadedImagesShow,
    setUploadedImagesShow,
    fetchSingleItem,
    updateProduct,
    deleteItem
  } = useItem();

  const { fetchCategories, categories } = useCategory();

  const { fetchSubCategories, subCats } = useSubCategory();

  //testing
  const tempItemId = "677a59a5bc4ce376520be6ff";

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    //fetchItems();
    //fetchSingleItem(tempItemId);
  }, []);

  const handleCreateProduct = () => {
    const result = itemSchema.safeParse(item);
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
    } else {
      createProduct(item);
    }
  };
  const handleUpdateProduct = () => {
    const result = itemSchema.safeParse(updatingItem);
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
    } else {
      updateProduct();
    }
  };
  

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPending(true);
    if (event.target.files) {
      const filesArray = Array.from(event.target.files); // creates a new, shallow-copied array instance from an array-like or iterable object.
      const images = await uploadImages(filesArray);
      setUploadedImagesShow(images);
    }
    setPending(false);
  };

  // newSubCategory is {id: "60f7b1b3b3b3b3b3b3b3b3b3", name: "subCat1"}, here i need to get only id
  const newSubCategoryIds = updatingItem
    ? updatingItem?.newSubCategory?.map((subCat: any) => subCat.id)
    : item?.subCategory?.map((subCat: any) => subCat.id);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <p className="text-lg font-semibold mb-4">
        {updatingItem ? "Update" : "Create"} Item
      </p>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <div className="mt-4 flex flex-wrap gap-4">
          {uploadedImagesShow?.length > 0 ? (
            uploadedImagesShow.map((image: any) => (
              <div
                key={image.id}
                className="relative w-16 h-16 bg-gray-100 rounded-lg shadow-md overflow-hidden"
              >
                <button
                  className="absolute top-1 right-1 text-gray-700 hover:text-gray-900 bg-white rounded-full p-1 z-10"
                  onClick={() => {
                    deleteImage(image.id);
                  }}
                >
                  <RiDeleteBin5Line />
                </button>
                <Image
                  src={image.url}
                  alt={image.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">
              {pending ? "Uploading..." : "No images uploaded"}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={updatingItem ? updatingItem?.title : item?.title || ""}
          onChange={(e) =>
            updatingItem
              ? setUpdatingItem({ ...updatingItem, title: e.target.value })
              : setItem({ ...item, title: e.target.value })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.title && (
          <span className="text-red-500 text-sm">
            {errors.title._errors[0]}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={
            updatingItem ? updatingItem?.description : item?.description || ""
          }
          onChange={(e) =>
            updatingItem
              ? setUpdatingItem({
                  ...updatingItem,
                  description: e.target.value,
                })
              : setItem({ ...item, description: e.target.value })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description._errors[0]}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          value={updatingItem ? updatingItem?.price : item?.price || ""} // add || " " to avoid controlled to uncontrolled error in console
          onChange={(e) =>
            updatingItem
              ? setUpdatingItem({
                  ...updatingItem,
                  price: parseFloat(e.target.value),
                })
              : setItem({ ...item, price: parseFloat(e.target.value) })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.price && (
          <span className="text-red-500 text-sm">
            {errors.price._errors[0]}
          </span>
        )}
      </div>

      <div className="mb-4 flex items-center">
        <label
          htmlFor="available"
          className="block text-sm font-medium text-gray-700 mr-4"
        >
          Available
        </label>
        <input
          type="checkbox"
          id="available"
          checked={
            updatingItem ? updatingItem?.available : item?.available || false
          } // add || false to avoid controlled to uncontrolled error in console
          onChange={(e) =>
            updatingItem
              ? setUpdatingItem({
                  ...updatingItem,
                  available: e.target.checked,
                })
              : setItem({ ...item, available: e.target.checked })
          }
          className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          value={updatingItem ? updatingItem?.category : item?.category || ""}
          onChange={(e) =>
            updatingItem
              ? setUpdatingItem({
                  ...updatingItem,
                  category: e.target.value,
                  newSubCategory: [], //reset subCat when category change
                })
              : setItem({ ...item, category: e.target.value, subCategory: [] })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
        "
        >
          <option value="">Select Category</option>
          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="text-red-500 text-sm">
            {errors.category._errors[0]}
          </span>
        )}
      </div>

      <div className="mb-4">
        {subCats
          ?.filter(
            (ft: any) =>
              ft?.parentCategory ===
              (updatingItem?.category || // tis structure when user change other cat
                item?.category)
          )
          ?.map((subCat: any) => (
            <div key={subCat?.id} className="form-check">
              <input
                type="checkbox"
                value={subCat?.id}
                checked={updatingItem?.newSubCategory
                  ?.map((subCat: any) => subCat.id)
                  ?.includes(subCat.id)}
                //subCats selected / de-selected
                onChange={(e) => {
                  const subCatId = e.target.value; // get id
                  const subCatName = subCat?.name; // get name

                  // create [all selected subCat , if no then empty array] for subCat
                  //?? returns its right-hand operand when its left-hand operand is null or undefined, and otherwise returns its left-hand operand. So, updatingProduct?.tags ?? [] means if updatingProduct is null or undefined, it will return an empty array ([]), otherwise, it will return the tags of updatingProduct.
                  let selectedSubCat = updatingItem
                    ? [...(updatingItem?.newSubCategory ?? [])] //"tags" from set setUpdatingProduct || setProduct in below code!
                    : [...(item?.newSubCategory ?? [])];
                  // add or remove in []selectedSubCat
                  if (e.target.checked) {
                    newSubCategoryIds.includes(subCatId) //if id already there action null
                      ? null
                      : //selectedSubCat.push(subCatId);
                        selectedSubCat.push({ id: subCatId, name: subCatName });

                    //below is if de-select push out that id from[]:
                  } else {
                    // selectedSubCat = selectedSubCat.filter(
                    //   (t) => t !== subCatId
                    // );
                    selectedSubCat = selectedSubCat.filter(
                      (t) => t.id !== subCatId
                    );
                  }

                  //update state
                  if (updatingItem) {
                    setUpdatingItem({
                      ...updatingItem,
                      newSubCategory: selectedSubCat,
                    });
                  } else {
                    setItem({ ...item, newSubCategory: selectedSubCat });
                  }
                }}
              />{" "}
              <label>{subCat?.name}</label>
            </div>
          ))}
        {/* <span className="text-red-500 text-sm">{errors.subCategory._errors[0]}</span> */}
        {errors.subCategory && !errors.category && (
          <span className="text-red-500 text-sm">
            {errors.subCategory._errors[0]}
          </span>
        )}
      </div>

      <button
        className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={updatingItem ? handleUpdateProduct : handleCreateProduct}
      >
        {updatingItem ? "Update Item" : "Create Item"}
      </button>
      {updatingItem && (
        <button
          className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={() => deleteItem(updatingItem.id)}
        >
          Delete Item
        </button>
      )}

      {errors._errors && (
        <span className="text-red-500 text-sm">
          {/* {errors._errors[0]} */}
          please fill all fields
        </span>
      )}

      <div className="mb-4">
        {/* <p>Categories: {JSON.stringify(categories, null, 2)}</p> */}
        <br />
        {/* <p>Sub Categories: {JSON.stringify(subCats, null, 2)}</p> */}
        <br />
        <p>Items: {JSON.stringify(item, null, 2)}</p>
        <p>updatingItem: {JSON.stringify(updatingItem, null, 2)}</p>

        {/* <p>items: {JSON.stringify(items.slice(0, 2), null, 2)}</p> */}
        {/* <p>errors: {JSON.stringify(errors)}</p> */}
        {/* <p>selectedFile: {JSON.stringify(selectedFile)}</p> */}
      </div>
    </div>
  );
}
