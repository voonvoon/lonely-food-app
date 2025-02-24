import React from "react";
import Image from "next/image";

interface ItemCardProps {
  images: { url: string }[];
  title: string;
  description: string;
}

const ItemCard: React.FC<ItemCardProps & { price: string }> = ({
  images,
  title,
  description,
  price,
}) => {
  return (
    <div
      className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white transform transition duration-500 hover:scale-105 cursor-pointer"
      style={{ width: "30vw", height: "35vh" }}
    >
      {images?.length && (
      <Image
        className=" w-full h-32  object-cover"
        src={images[0].url}
        alt={title}
        width={250}
        height={250}
      />
      )}
      <div className="flex flex-col items-center px-3 py-1">
      <div className="text-sm mt-2 sm:text-lg font-thin">RM{price}</div>
      <div className="font-bold text-sm sm:text-lg text-center sm:text-md">{title}</div>
      <p className="text-gray-700 text-sm custom-hidden">
        {description.length > 100
        ? `${description.substring(0, 50)}...`
        : description}
      </p>
      </div>
    </div>
  );
};

export default ItemCard;
