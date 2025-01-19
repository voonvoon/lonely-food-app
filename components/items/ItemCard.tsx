import React from "react";
import Image from "next/image";

interface ItemCardProps {
  images: { url: string }[];
  title: string;
  description: string;
}

const ItemCard: React.FC<ItemCardProps & { price: string }> = ({ images, title, description, price }) => {
  return (
    <div
      className="max-w-xs rounded overflow-hidden shadow-lg bg-white transform transition duration-500 hover:scale-105 cursor-pointer"
      style={{ width: "250px", height: "250px" }}
    >
      {images?.length && (
        <Image
          className="w-full h-32 object-cover"
          src={images[0].url}
          alt={title}
          width={250}
          height={250}
        />
      )}
      <div className="px-3 py-1">
      <div className="text-lg mt-2">RM{price}</div>
        <div className="font-bold text-xl">{title}</div>
        <p className="text-gray-700 text-base">
          {description.length > 100
            ? `${description.substring(0, 50)}...`
            : description}
        </p>

      </div>
    </div>
  );
};

export default ItemCard;
