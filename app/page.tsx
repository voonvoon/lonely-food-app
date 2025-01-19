//import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">
      Welcome to the Lonely Food App
      </h1>

      <Link href="/menu">
      <div className="mt-4 px-6 py-3 border-2 border-pink-500 text-pink-500 rounded hover:bg-pink-500 hover:text-white transition-colors duration-300">
        Go to Menu
      </div>
      </Link>
    </div>
  );
}
