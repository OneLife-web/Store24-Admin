import { CreateRequestBody, UpdateSettingsPayload } from "@/types";

export const addSettings = async ({
  bannerTitle,
  bannerLink,
  promotionTitle,
  promotionLink,
  promotionImageUrl,
  promotionFeatures,
}: CreateRequestBody) => {
  try {
    //
    const res = await fetch(
      "https://store24-admin-sepia.vercel.app/api/settings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bannerTitle,
          bannerLink,
          promotionTitle,
          promotionLink,
          promotionImageUrl,
          promotionFeatures,
        }),
      }
    );

    const result = await res.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getSettings = async () => {
  try {
    const res = await fetch("https://store24-admin-sepia.vercel.app/api/settings", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} - ${await res.text()}`);
    }

    const result = await res.json(); // Read body only once
    return result;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

export const updateSettings = async (payload: UpdateSettingsPayload) => {
  try {
    const response = await fetch(
      "https://store24-admin-sepia.vercel.app/api/settings",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error; // Propagate error to be handled by the caller
  }
};
