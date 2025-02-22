"use client";

import {login} from "@/actions/auth";
import { IoLogoGoogle } from "react-icons/io5";

function LoginGoogle() {
  return (
    <div onClick={() => login("google")} className="w-full gap-4 hover:cursor-pointer mt-6 h-12 rounded-md p-4 flex justify-center items-center border border-gray-300 bg-gray-100 shadow-sm">
      <IoLogoGoogle className="text-red-500" />
      <p className="text-gray-700">Login with Google</p>
    </div>
  )
}

export default LoginGoogle
