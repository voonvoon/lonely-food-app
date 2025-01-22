import { useState } from "react";
import Image from "next/image";

interface PhotoSlideShowProps {
  images: { url: string }[];
  item: { title: string };
}

const PhotoSlideShow = ({ images, item }: PhotoSlideShowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);



  //The modulo operator (%) gives the remainder of a division. For example, if you divide 7 by 3, the result is 2 with a remainder of 1. The modulo operator gives you that remainder.
  //example: prevIndex + 1 would be 4 + 1 = 5.
  //5 % 5 equals 0, so the index resets to 0, showing the first image again.
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto h-[500px] overflow-hidden">
      <div className="relative h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              className="w-full h-full object-cover"
              src={image.url}
              alt={`${item.title} image ${index + 1}`}
              layout="fill" // use this don't use height and width
            />
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &#10095;
      </button>
    </div>
  );
};

export default PhotoSlideShow;
