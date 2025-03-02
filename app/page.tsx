"use client";

import Link from "next/link";

//import { createTestTables } from "@/actions/tableActive";

export default function Home() {
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
          View Menu
        </div>
      </Link>

      {/* <div
        onClick={createTestTables}
        className="mt-4 px-4 py-2 text-gray-700 text-xl font-semibold rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-300 bg-white bg-opacity-75 shadow-lg transform hover:scale-105 sm:text-3xl sm:px-8 sm:py-4 cursor-pointer"
      >
        Create Test Tables
      </div> */}

      {/* <div
        onClick={handleDineInClick}
        className="mt-4 px-4 py-2 text-gray-700 text-xl font-semibold rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-300 bg-white bg-opacity-75 shadow-lg transform hover:scale-105 sm:text-3xl sm:px-8 sm:py-4 cursor-pointer"
      >
        Dine In
      </div> */}
    </div>
  );
}


