import { ReactNode } from "react";
import MenuNavbar from "@/components/nav/MenuNavbar";

interface MenuProps {
  children: ReactNode;
}

export default async function Menu({ children }: MenuProps) {
  return (
    <div className="grid min-h-screen grid-cols-10">
    <div className="col-span-3 sm:col-span-2">
      <MenuNavbar />
    </div>
    <div className="col-span-7 sm:col-span-8">
      {children}
    </div>
  </div>
  );
}
