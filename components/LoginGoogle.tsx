"use client";

import {login} from "@/actions/auth";
import { IoLogoGoogle } from "react-icons/io5";

function LoginGoogle() {
  return (
    <div onClick={() => login("google")} className="w-full gap-4 hover:cursor-pointer mt-6 h-12 bg-black rounded-md p-4 flex justify-center items-center">
      <IoLogoGoogle className="text-white" />
      <p className="text-white">Login with Google</p>
    </div>
  )
}

export default LoginGoogle
