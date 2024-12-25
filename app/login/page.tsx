import LoginGoogle from "@/components/LoginGoogle";
import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";

const login = () => {
  return (
    <div className="w-full flex mt-20 justify-center ">
      <section className="flex flex-col w-[400px]">
        <h1 className="text-3xl w-full text-center font-bold mb-6">Sign in</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
          <LoginGoogle />
        </Suspense>
      </section>
    </div>
  );
};

export default login;


