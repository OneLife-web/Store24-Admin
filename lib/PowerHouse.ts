import { CreateRequestBody } from "@/types";

export const addSettings = async ({
  bannerTitle,
  bannerLink,
  promotionTitle,
  promotionLink,
  promotionImageUrl,
}: CreateRequestBody) => {
  try {
    const res = await fetch("http://localhost:3001/api/settings", {
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
      }),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};
