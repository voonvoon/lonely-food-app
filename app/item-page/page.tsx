"use client";
import { Suspense, useEffect, useState, useContext } from "react";

import { useSearchParams } from "next/navigation";
import { MenuContext } from "@/context/menu";
import { Item } from "@/types-folder/types";
import { OrderContext } from "@/context/order"; // Import OrderContext
import Image from "next/image";
import PhotoSlideShow from "@/components/items/PhotoSlideShow";
import QuantitySelector from "@/components/items/QuantitySelector";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { cartItems, setCartItems, isSidebarOpen, setIsSidebarOpen } =
    useContext(OrderContext);
  const { fetchSingleItem } = useContext(MenuContext);

  const [item, setItem] = useState<Item | null>(null);

  const [quantity, setQuantity] = useState<number>(1);

  console.log("cartItems------------------------------------>", cartItems);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const singleItem = await fetchSingleItem(id);
        console.log("singleItem---------------->", singleItem);
        setItem(singleItem);
      }
    };
    fetchData();
  }, [id, fetchSingleItem]);

  //sync with local storage
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, [setCartItems]);

  const handleAddItem = () => {
    //check if item is already in the cart, is yes update the quantity only
    if (item) {
      const existingItemIndex = cartItems.findIndex(
        (cartItem: { id: any }) => cartItem.id === item.id
      );
      let updatedCartItems;
      //-1: item was not found in an array. here means have
      if (existingItemIndex !== -1) {
        updatedCartItems = cartItems.map(
          (cartItem: { number: number }, index: any) =>
            index === existingItemIndex
              ? { ...cartItem, number: cartItem.number + quantity }
              : cartItem
        );
      } else {
        const newItem = {
          id: item.id,
          title: item.title,
          price: item.price,
          number: quantity,
        };
        updatedCartItems = [...cartItems, newItem];
      }
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setIsSidebarOpen(true);
    }
  };

  if (!id) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!item) {
    return (
      <div className="text-center text-gray-500">Loading item details...</div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-4 max-w-2xl mx-auto flex flex-col items-center">
        {item.images.length > 1 ? (
          <PhotoSlideShow images={item.images} item={item} />
        ) : (
          <Image
            className="w-full h-auto mb-4 rounded"
            src={item.images[0].url}
            alt={item.title}
            width={500}
            height={300}
          />
        )}
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Add Item
        </button>
        <p className="text-gray-700 mt-16 mb-4">{item.description}</p>
        <p className="text-lg font-semibold mb-2">
          <strong>Price:</strong> ${item.price}
        </p>
        <p className="text-lg font-semibold mb-2">
          <strong>Category:</strong> {item.newSubCategory[0]?.name || "N/A"}
        </p>
        <p className="text-lg font-semibold mb-2">
          <strong>Availability:</strong>{" "}
          {item.available ? "In Stock" : "Out of Stock"}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <strong>Created At:</strong>{" "}
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Updated At:</strong>{" "}
          {new Date(item.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </Suspense>
  );
}
