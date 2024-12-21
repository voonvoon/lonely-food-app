"use client";

import React, { useState } from "react";
import AuthButton from "./AuthButton";
import { RegisterWithCreds } from "@/actions/auth";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const RegisterForm = () => {
    const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await RegisterWithCreds(formData);
      if (response?.error) {
        setError(response.error);
      } else {
        toast.success('Successfully registered');
        router.push('/login');
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
          <AuthButton buttonText="Register" />
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;


