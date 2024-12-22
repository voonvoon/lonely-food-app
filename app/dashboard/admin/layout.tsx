import { ReactNode } from "react";
import AdminNavbar from "@/components/nav/AdminNavbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface AdminDashboardProps {
  children: ReactNode;
}

export default async function AdminDashboard({
  children,
}: AdminDashboardProps) {

  //only admin can access this page
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }
  
  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
}
