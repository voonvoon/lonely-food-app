import { ReactNode } from "react";
import MenuNavbar from "@/components/nav/MenuNavbar";

interface MenuProps {
  children: ReactNode;
}

export default async function Menu({ children }: MenuProps) {
  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <div className="w-full md:w-1/4">
      <MenuNavbar />
      </div>
      <div className="w-full md:w-3/4">
      {children}
      </div>
    </div>
  );
}
