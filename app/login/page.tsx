import LoginGoogle from "@/components/LoginGoogle";
import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";

const login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <section className="flex flex-col w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Sign in</h1>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <LoginForm />
          <div className="mt-4">
            <LoginGoogle />
          </div>
        </Suspense>
      </section>
    </div>
  );
};

export default login;


