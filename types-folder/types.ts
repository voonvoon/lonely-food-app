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