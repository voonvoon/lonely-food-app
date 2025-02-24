"use client"

import Link from "next/link";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Home() {
  const tableNo = 1;

  const handleDineInClick = () => {
    const checkinId = generateCheckinId();
    Cookies.set('checkinId', checkinId, { expires: 1/5 });
    Cookies.set('tableNo', tableNo.toString(), { expires: 1/5 });
    window.location.href = `/menu?table=${tableNo}&checkin=${checkinId}`;
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/wallpaper.jpg')" }}
    >
      {/* <h1 className="text-4xl font-bold text-gray-800 bg-white bg-opacity-75 p-4 rounded">
        Welcome to the Lonely Food App
      </h1> */}

      <Link href="/menu">
        <div className="mt-4 px-4 py-2 text-gray-700 text-xl font-semibold rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-300 bg-white bg-opacity-75 shadow-lg transform hover:scale-105 sm:text-3xl sm:px-8 sm:py-4">
          Take Away
        </div>
      </Link>

      <div
        onClick={handleDineInClick}
        className="mt-4 px-4 py-2 text-gray-700 text-xl font-semibold rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-300 bg-white bg-opacity-75 shadow-lg transform hover:scale-105 sm:text-3xl sm:px-8 sm:py-4 cursor-pointer"
      >
        Dine In
      </div>
    </div>
  );
}

function generateCheckinId() {
  return Math.random().toString(36).substr(2, 9);
}


