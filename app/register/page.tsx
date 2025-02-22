import LoginGoogle from "@/components/LoginGoogle";
import RegisterForm from "@/components/RegisterForm";

const register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <section className="flex flex-col w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Register</h1>
        <RegisterForm />
        <div className="mt-4">
          <LoginGoogle />
        </div>
      </section>
    </div>
  );
};

export default register;
