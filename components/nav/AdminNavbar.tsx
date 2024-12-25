

import Link from "next/link";


export default function AdminNavbar() {
  return (
    <div className="flex justify-center mb-3">
      <Link href="/dashboard/admin" className="px-4 py-2 text-gray-700 hover:text-gray-900">
        Admin
      </Link>
      <Link href="/dashboard/admin/categories" className="px-4 py-2 text-gray-700 hover:text-gray-900">
        Category
      </Link>
      <Link href="/dashboard/admin/sub-categories" className="px-4 py-2 text-gray-700 hover:text-gray-900">Sub Category</Link>
      <Link href="/dashboard/admin/coupon" className="px-4 py-2 text-gray-700 hover:text-gray-900">Coupon</Link>
      <Link href="/dashboard/admin/orders" className="px-4 py-2 text-gray-700 hover:text-gray-900">Orders</Link>
      <Link href="/dashboard/admin/newproducttest" className="px-4 py-2 text-gray-700 hover:text-gray-900">Add Product</Link>
      <Link href="/dashboard/admin/newproducts" className="px-4 py-2 text-gray-700 hover:text-gray-900">All Products</Link>
    </div>
  );
}