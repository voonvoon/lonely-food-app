import CreateItem from "@/components/items/CreateItem";

//https://github.com/kaloraat/react-ecommerce/blob/main/final/server/models/product.js

export default function AdminCreateItem() {
  return (
    <div className="container mx-auto mb-5">
      <div className="flex flex-col">
        <div className="mb-4">
          <p className="text-lg font-semibold"></p>
        </div>
        <CreateItem />
      </div>

      <div className="flex flex-col">
        <div className="mb-4">

        </div>
      </div>
    </div>
  );
}

