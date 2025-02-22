"use client";

import { useState, useEffect, useContext } from "react";
import { OrderContext } from "@/context/order";
import Link from "next/link";
import { GiFoodTruck } from "react-icons/gi";
import { IoMenu } from "react-icons/io5";
import { auth } from "@/auth";
//import Logout from "../Logout";
import { useSession, signOut } from "next-auth/react";
import Sidebar from "./SideBar";

//import { auth } from "@/auth";

const Navbar = () => {
  const { data, status, update } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { cartItems, isSidebarOpen, setIsSidebarOpen } =
    useContext(OrderContext);

  // Update the login status when the login status changes
  useEffect(() => {
    const emailUpdatedEventHandler = () => update(); // Call the update function when the login status changes
    window.addEventListener("loginUpdated", emailUpdatedEventHandler, false); // Add an event listener to listen for the custom event
    return () => {
      window.removeEventListener("loginUpdated", emailUpdatedEventHandler); // Remove the event listener when the component is unmounted
    };
  }, [update]); // Call the effect when the update function changes

  const user = data?.user;
  console.log("login Status-------------->", { data, status });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center justify-start">
            <div className="flex items-center justify-center">
              <Link href="/" className="flex flex-col items-center">
                <GiFoodTruck size={30} color="white" />
                <span className="text-xs text-white mt-1">Lonely Food App</span>
                <div className="flex items-center justify-center"> </div>
              </Link>
            </div>
            {/* <Link href="/test-middleware" className="m-4">
              middleware
            </Link>
            <Link href="/test-server">server</Link> */}
          </div>

          <div className="absolute right-0 flex items-center ">
            <button
              className="flex items-center justify-center rounded-md p-1 text-gray-400 hover:bg-red-400 hover:text-white"
              onClick={toggleMenu}
            >
              <IoMenu size={30} />
            </button>
          </div>

          <div className="absolute right-10">
            {status === "authenticated" ? (
              <>
                <Link
                  href={`/dashboard/${
                    user?.role === "ADMIN" ? "admin" : "user"
                  }`}
                  //href={`/dashboard`}
                  className="rounded-md px-1 py-2 text-sm  text-gray-300 hover:bg-red-400 hover:text-white"
                >
                  {user?.name ? user.name : user?.email}
                </Link>

                <button
                  className="cursor-pointer rounded-md px-1 py-2 text-sm  text-gray-300 hover:bg-red-400 hover:text-white"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-1 py-2 text-sm  text-gray-300 hover:bg-red-500 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md px-1 py-2 text-sm  text-gray-300 hover:bg-red-500 hover:text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-1000 ease-in-out ${
          isMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="px-2 pb-1 pt-2 text-center  transition-all duration-300 ease-in-out">
          <button
            className="block w-full rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-red-500 hover:text-white"
            onClick={() => setIsSidebarOpen(true)}
          >
            Cart
          </button>
          <Link
            href="/menu"
            className="block rounded-md px-3 py-2 text-sm  text-gray-300 hover:bg-red-500 hover:text-white"
          >
            Menu
          </Link>
          <Link
            href="/dashboard/admin"
            className="block rounded-md px-3 py-2 text-sm  text-gray-300 hover:bg-red-500 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <Sidebar />
    </nav>
  );
};

export default Navbar;
