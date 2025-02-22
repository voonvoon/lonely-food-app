import React from "react";
import { useFormStatus } from "react-dom";

interface AuthButtonProps {
  buttonText: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ buttonText }) => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className={`w-full p-2 rounded-md border-2 ${
      pending ? "bg-gray-200 border-gray-400" : "bg-gray-100 border-gray"
      } text-black`}
    >
      {pending ? "Loading..." : buttonText}
    </button>
  );
};

export default AuthButton;
