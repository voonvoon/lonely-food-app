"use server";

import axios from "axios";
import open from "open";

// export async function getAuthorizationCode() {
//   const clientId = "spQA7s3k9OlxpsMXyEZJIxOc8NaqNliYhjggNoDz";
//   const redirectUri = "https://www.ezeep.com/";
//   const authUrl = `https://account.ezeep.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
//     redirectUri
//   )}`;

//   try {
//     const response = await axios.post(authUrl, null, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     console.log("Authorization Code Response:", response.data);
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error(
//         "Error fetching authorization code:",
//         error.response?.data || error.message
//       );
//     } else {
//       console.error("Error fetching authorization code:", error);
//     }
//     throw error;
//   }
// }

export async function getAuthorizationCode() {
  const clientId = process.env.EZEEP_CLIENT_ID; 
  const redirectUri = "https://www.ezeep.com/";
  const authUrl = `https://account.ezeep.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;

  try {
    // Open the authorization URL in the default browser
    console.log("Opening browser for login...");
    await open(authUrl);

    console.log(
      "Please complete the login process in the browser. After authorization, the server will redirect to the redirect URI with the authorization code."
    );

    // Note: You will need to manually extract the authorization code from the redirect URI.
    return "Browser opened for login. Check the redirect URI for the authorization code.";
  } catch (error) {
    console.error("Error opening browser for login:", error);
    throw error;
  }
}

export async function getAccessToken() {
  const clientId = process.env.EZEEP_CLIENT_ID; // Ensure EZEEP_CLIENT_ID is set in your environment variables
  const clientSecret = process.env.EZEEP_CLIENT_SECRET; // Ensure EZEEP_CLIENT_SECRET is set in your environment variables
  //const tokenUrl = "https://api.ezeep.com/oauth/token"; // Ezeep's OAuth endpoint

  console.log("Client ID---------------------->", clientId);
  console.log("Client Secret--------------------------->", clientSecret);
  const tokenUrl = "https://account.ezeep.com/oauth/access_token";
  
  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams(
        clientId && clientSecret
          ? {
              grant_type: "client_credentials", // OAuth flow type
              client_id: clientId,
              client_secret: clientSecret,
            }
          : {}
      ),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    console.log("Access Token:", accessToken);
    return accessToken;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching access token:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching access token:", error);
    }
    throw error;
  }
}

export async function sendPrintJob(printerId: string, base64Data: string) {
  const accessToken = await getAccessToken(); // Fetch the access token
  const printJobUrl = "https://api.ezeep.com/print/v1/jobs"; // Ezeep's print job endpoint

  try {
    const response = await axios.post(
      printJobUrl,
      {
        printerId: printerId, // The ID of the printer you want to use
        document: {
          content: base64Data, // Base64-encoded document data
          contentType: "application/octet-stream", // For raw ESC/POS commands
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the access token
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Print job sent successfully:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error sending print job:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error sending print job:", error);
    }
  }
}
