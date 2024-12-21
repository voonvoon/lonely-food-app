import LoginGoogle from "@/components/LoginGoogle";
import RegisterForm from "@/components/RegisterForm";

const login = () => {
  return (
    <div className="w-full flex mt-20 justify-center ">
      <section className="flex flex-col w-[400px]">
        <h1 className="text-3xl w-full text-center font-bold mb-6">Register</h1>
        <RegisterForm />
        <LoginGoogle />
      </section>
    </div>
  );
};

export default login;
