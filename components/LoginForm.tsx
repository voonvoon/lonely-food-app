"use client";

import React, { useState } from "react";
import AuthButton from "./AuthButton";
import { loginWithCreds } from "@/actions/auth";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await loginWithCreds(formData);

      // due to redirect in server side this toast will not be shown, figure out later
      // if (response?.success) {
      //   toast.success("Successfully logged in");
      
      // }

      if (response?.error) {
        setError(response.error);
      } else {
         router.push(callbackUrl);
         toast.success("Successfully logged in");
         window.dispatchEvent(new CustomEvent("loginUpdated")); // Dispatch a custom event to update the login in the Navbar
      }
    } catch (err) {
      setError("Unexpected error occurred");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            id="Email"
            name="email"
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
          />
        </div>
        {error && <div className="text-red-500 text-xs">{error}</div>}
        <div className="mt-4">
          <AuthButton buttonText="Sign in" />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

//old code:
// import React from "react";
// import AuthButton from "./AuthButton";
// import { loginWithCreds } from "@/actions/auth";

// const LoginForm = () => {
//   return (
//     <div>
//       <form action={loginWithCreds} className="w-full flex flex-col gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-200">
//             Email
//           </label>
//           <input
//             type="email"
//             placeholder="Email"
//             id="Email"
//             name="email"
//             className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-200">
//             Password
//           </label>
//           <input
//             type="password"
//             placeholder="Password"
//             name="password"
//             id="password"
//             className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
//           />
//         </div>
//         <div className="mt-4">
//           <AuthButton />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;
