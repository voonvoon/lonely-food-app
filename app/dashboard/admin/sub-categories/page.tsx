import SubCatCreate from "@/components/subCategories/SubCatCreate";
import SubCategoryList from "@/components/subCategories/SubCatList";

export default function AdminSubCategory() {
  return (
    <div className="container mx-auto mb-5">
      <div className="flex flex-col">
        <div className="mb-4">
          <p className="text-lg font-semibold">Create Sub Category</p>
        </div>
            <SubCatCreate />
      </div>

      <div className="flex flex-col">
        <div className="mb-4">
          <SubCategoryList />
        </div>
      </div>
    </div>
  );
}
