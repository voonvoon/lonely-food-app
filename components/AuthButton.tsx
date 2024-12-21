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
      className={`w-full p-2 rounded-md ${
        pending ? "bg-gray-500" : "bg-blue-500"
      } text-white`}
    >
      {pending ? "Loading..." : buttonText}
    </button>
  );
};

export default AuthButton;
