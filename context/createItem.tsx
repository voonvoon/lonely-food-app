"use client";
import { createContext, useState, useContext, ReactNode } from "react";
import toast from "react-hot-toast";
import {
  createItemAction,
  deleteImageAction,
  fetchItemsAction,
  fetchSingleItemAction,
  updateItemAction,
  deleteItemAction,
} from "@/actions/createItem";
import Resizer from "react-image-file-resizer";
import { Buffer } from "buffer";
import { uploadImage } from "@/actions/createItem";

export const ItemContext = createContext<any>(undefined);

interface ItemProviderProps {
  children: ReactNode;
}

// const dummyItem = {
//   title: "Sample Title2",
//   slug: "",
//   description: "Sample description of the item.",
//   price: 19.99,
//   available: false,
//   category: "676ba09ca83ead9eeac62231",
//   subCategory: [
//     //  "676bac46a83ead9eeac62292",
//     //  "676bac41a83ead9eeac62291"

//   ],
// };

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const [pending, setPending] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [updatingItem, setUpdatingItem] = useState<any>(null);
  const [uploadedImagesShow, setUploadedImagesShow] = useState([]) as any;

  const createProduct = async (itemData: any) => {
    try {
      const data = await createItemAction(itemData);

      if (!data) {
        toast.error("Failed to create item");
      } else {
        toast.success("item created🙂.");
        setItem(null);
        window.location.reload();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setPending(false);
    }
  };

  //fetch all items
  const fetchItems = async () => {
    try {
      const data = await fetchItemsAction();
      if (!data) {
        toast.error("Failed to fetch items");
      } else {
        setItems(data);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setPending(false);
    }
  };

  async function uploadImages(images: FileList) {
    //nested ternally
    let uploadedImages = updatingItem // if have 'updatingProduct'
      ? updatingItem?.images || [] // grab that img or [empty]
      : item //if hv 'product'
      ? item?.images || [] //grab that img or [empty]
      : []; //else just [empyt]

    if (images) {
      //check if total combinedAA img 4+?
      const totalImages = uploadedImages?.length + images?.length;
      if (totalImages > 3) {
        toast.error("You can upload maximum 3 images only");
        //if i only 'return' it will return empty array, my photos preview will be empty, so return uploadedImages here
        return uploadedImages;
      }
    }

    //limit image size to 2MB
    const maxSizeMB = 2; // Set the maximum size limit in MB
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      // Check if the image size exceeds the limit
      if (image.size > maxSizeBytes) {
        toast.error(
          `Image ${image.name} is too large. Please upload an image less than ${maxSizeMB}MB.`
        );
        continue; // Skip this image
      }

      // console.log(`Original size of ${image.name}: ${image.size / 1024} KB`);

      // Compress the image
      const compressedImage = await new Promise<File | Blob>((resolve) => {
        Resizer.imageFileResizer(
          image,
          1920, // max width
          1920, // max height
          "JPEG", // format
          70, // quality
          0, // rotation
          (uri) => {
            resolve(uri as Blob);
          },
          "blob" // output type
        );
      });

      //  console.log(`Compressed size of ${image.name}: ${compressedImage.size / 1024} KB`);

      //reads image file and converts it into an ArrayBuffer, which is a low-level representation of binary data.
      const imageData = await compressedImage.arrayBuffer();
      //Base64 commonly used to encode binary data (images) into a text format so easily transmitted over text-based protocols such as HTTP.(binary --> string)
      const base64ImageData = Buffer.from(imageData).toString("base64");

      const imageName = image.name;

      const response = await uploadImage(base64ImageData, imageName);

      if (response.success) {
        if (response.image) {
          const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-image?id=${response.image.id}`;
          uploadedImages.push({
            id: response.image.id,
            name: imageName,
            url: imageUrl,
          });
          setItem((prevItem: any) => ({
            ...prevItem,
            images: uploadedImages,
          }));
          toast.success("Image uploaded successfully");
          //auto save if user add more photo when updating item to avoid db inconsistency between item and images
          if (updatingItem) {
            const updatedItem = {
              ...updatingItem,
              images: uploadedImages,
            };
            setUpdatingItem(updatedItem);
            const autoUpdate = await updateItemAction(updatedItem);
            if (autoUpdate) {
              toast.success("Item auto save successfully.");
            }
          }
        } else {
          console.error("Image data is undefined");
        }
        console.log("image successfully");
      } else {
        console.error("Failed to upload image:", response.error);
      }
    }

    return uploadedImages;
  }

  //delete image
  const deleteImage = async (imageId: string) => {
    try {
      const data = await deleteImageAction(imageId);
      if (!data) {
        toast.error("Failed to delete image");
      } else {
        toast.success("Image deleted successfully");
         //auto save if user delete photo when updating item to avoid db inconsistency between item and images
        if (updatingItem) {
          const updatedItem = {
            ...updatingItem,
            images: updatingItem.images.filter(
              (img: any) => img.id !== imageId
            ),
          };
          setUpdatingItem(updatedItem);
          const autoUpdate = await updateItemAction(updatedItem);
          if (autoUpdate) {
            toast.success("Item auto save successfully.");
          }
        } else if (item) {
          setItem((prevItem: any) => ({
            ...prevItem,
            images: prevItem.images.filter((img: any) => img.id !== imageId),
          }));
        }
        //reflect latest photo in uploadedImages
        setUploadedImagesShow((prevImages: any) =>
          prevImages.filter((img: any) => img.id !== imageId)
        );
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setPending(false);
    }
  };

  //fetch single item
  const fetchSingleItem = async (id: string) => {
    try {
      const data = await fetchSingleItemAction(id);
      if (!data) {
        toast.error("Failed to fetch item");
      } else {
        setUpdatingItem(data);
        setUploadedImagesShow(data.images);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setPending(false);
    }
  };

  //update item
  const updateProduct = async () => {
    try {
      const data = await updateItemAction(updatingItem);
      if (!data) {
        toast.error("Failed to update item");
      } else {
        toast.success("Item updated successfully");
        setItem(null);
        window.location.reload();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setPending(false);
    }
  };

  //delete item
  const deleteItem = async (id: string) => {
    try {
      const data = await deleteItemAction(id);
      if (!data) {
        toast.error("Failed to delete item");
      } else {
        toast.success("Item deleted successfully");
        setUpdatingItem(null);
        setUploadedImagesShow(null);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <ItemContext.Provider
      value={{
        item,
        setItem,
        items,
        setItems,
        createProduct,
        updatingItem,
        setUpdatingItem,
        fetchItems,
        uploadImages,
        pending,
        setPending,
        deleteImage,
        uploadedImagesShow,
        setUploadedImagesShow,
        fetchSingleItem,
        updateProduct,
        deleteItem,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItem: any = () => useContext(ItemContext);
