import CategoryCreate from "@/components/categories/CategoriesCreate";
import CategoryList from "@/components/categories/CategoriesList";

// import CategoryCreate from "@/components/category/CategoryCreate";
// import CategoryList from "@/components/category/CategoryList";

export default function AdminCategory() {
  return (
    <div className="container mx-auto mb-5">
      <div className="flex flex-col">
        <div className="mb-4">
          <p className="text-lg font-semibold">Create Category</p>
          <CategoryCreate />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="mb-4">
          <CategoryList />
        </div>
      </div>
    </div>
  );
}
