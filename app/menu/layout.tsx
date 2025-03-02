"use client";

import { ReactNode, useEffect, Suspense } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import MenuNavbar from "@/components/nav/MenuNavbar";
import { decrypt } from "@/utils/encryption"; // Import encryption functions

interface MenuProps {
  children: ReactNode;
}

const generateUserId = (): string => {
  const now = new Date();
  const dateString = now
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14); // Remove unwanted characters and limit to 14 characters
  const uniqueSuffix = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0"); // Ensure uniqueness with exactly 4 digits
  const userId = `qruser${dateString}${uniqueSuffix}`;

  return userId;
};

function MenuContent({ children }: MenuProps) {
  const searchParams = useSearchParams();
  const cardNo = searchParams.get("cardno");
  const checkId = searchParams.get("checkid");
  const tableNo = searchParams.get("tableno") || " ";

  if (checkId) {
    //console.log("checkId------------->>", checkId);

    let decryptedCheckId;
    try {
      //Replace spaces with + signs, WHY??
      //cuz checkId passed as param in URL,the + converted to a space when it passed in the URL(searchParams.get("checkid")).
      //So need replace the space with + sign before decrypting the checkId to avoid error:"Malformed UTF-8 data" error because the checkId is not in its correct form.
      const correctedCheckId = checkId.replace(/ /g, "+");
      //console.log("correctedCheckId------------->>", correctedCheckId);
      // Decrypt the corrected checkId
      decryptedCheckId = decrypt(correctedCheckId);
    } catch (error) {
      console.error("Decryption error:", error);
      decryptedCheckId = null;
    }

    //console.log("decryptedCheckId------------->>", decryptedCheckId);

    if (decryptedCheckId) {
      const decryptedCheckIdNumber = Number(decryptedCheckId);

      // console.log(
      //   "decryptedCheckIdNumber------------->>",
      //   decryptedCheckIdNumber
      // );

      const currentTime = new Date();
      const currentTimeInSeconds = Math.floor(currentTime.getTime() / 1000);

      //console.log("currentTimeInSeconds------------->>", currentTimeInSeconds);

      const timeDifference = currentTimeInSeconds - decryptedCheckIdNumber;
      //const timeDifference = 7200; //test
      //console.log("timeDifference------------->>", timeDifference);

      if (timeDifference >= 60 * 60 * 2) {
        // 2 hours session
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center text-red-500 text-2xl">
              Sorry, session expired more than 2 hours, please scan QR code
              again.
            </div>
          </div>
        );
      }
    }
  }

  useEffect(() => {
    if (cardNo && checkId) {
      Cookies.set("cardNo", cardNo, { expires: 1 / 5 });
      Cookies.set("dineInUser", generateUserId(), { expires: 1 / 5 });
      Cookies.set("tableNo", tableNo, { expires: 1 / 5 });
      //checkSessionStatus(checkin);
    }
  }, [cardNo, checkId]);

  return (
    <div className="grid min-h-screen grid-cols-10">
      <div className="col-span-3 sm:col-span-2">
        <MenuNavbar />
      </div>
      <div className="col-span-7 sm:col-span-8">{children}</div>
    </div>
  );
}

export default function Menu({ children }: MenuProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuContent children={children} />
    </Suspense>
  );
}
