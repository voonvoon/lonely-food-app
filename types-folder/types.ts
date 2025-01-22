export type Category = {
    id?: string
    name: string;
    //slug: string;
  };


  export type SubCategory = {
    id?: string
    name: string;
    slug: string;
    parentCategory: string;
  };

  
  export type Item = {
    id: any;
    title: string;
    images: { url: string }[];
    description: string;
    price: number;
    newSubCategory: { name: string }[];
    available: boolean;
    createdAt: string;
    updatedAt: string;
  }

  //create OrderContextType 
  export type OrderContextType = {
    cartItems: { id: string; title: string; price: number; number: number }[];
    setCartItems: React.Dispatch<
      React.SetStateAction<{ id: string; title: string; price: number; number: number }[]>
    >;
  };