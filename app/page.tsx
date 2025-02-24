"use client";

import Link from "next/link";
import { useEffect, Suspense } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const searchParams = useSearchParams();
  const table = searchParams.get("table") || "";
  const checkin = searchParams.get("checkin") || "";

  useEffect(() => {
    if (table && checkin) {
      Cookies.set("checkinId", checkin, { expires: 1 / 5 });
      if (table) {
        Cookies.set("tableNo", table, { expires: 1 / 5 });
      }
      //checkSessionStatus(checkin);
    }
  }, [table, checkin]);

  // const checkSessionStatus = async (checkinId: string) => {
  //   const response = await fetch(`/api/check-session?checkin=${checkinId}`);
  //   const data = await response.json();
  //   if (data.active) {
  //     window.location.href = `/order-status?checkin=${checkinId}`;
  //   }
  // };

  // const handleDineInClick = () => {
  //   const checkinId = `table${table}checkin`; // Fixed checkin ID for each table
  //   Cookies.set("checkinId", checkinId, { expires: 1 / 5 });
  //   Cookies.set("tableNo", table, { expires: 1 / 5 });
  //   window.location.href = `/menu?table=${table}&checkin=${checkinId}`;
  // };

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
        onClick={handleDineInClick}
        className="mt-4 px-4 py-2 text-gray-700 text-xl font-semibold rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-300 bg-white bg-opacity-75 shadow-lg transform hover:scale-105 sm:text-3xl sm:px-8 sm:py-4 cursor-pointer"
      >
        Dine In
      </div> */}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

// function generateCheckinId() {
//   return Math.random().toString(36).substr(2, 9);
// }
