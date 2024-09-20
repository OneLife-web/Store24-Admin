import {
  CreateRequestBody,
  productData,
  updateData,
  UpdateSettingsPayload,
} from "@/types";

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
    const res = await fetch(
      "https://store24-admin-sepia.vercel.app/api/settings",
      {
        method: "GET",
        cache: "no-store",
      }
    );

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

export const fetchProducts = async () => {
  try {
    const res = await fetch("/api/products", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.products;
  } catch (error) {
    console.error("Error fetching prducts:", error);
    throw error;
  }
};

export const fetchProduct = async (id: string) => {
  try {
    const res = await fetch(`/api/products/${id}`, { method: "GET" });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.product;
  } catch (error) {
    console.error("Error fetching prduct:", error);
    throw error;
  }
};

export const createProduct = async (productData: productData) => {
  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.product;
  } catch (error) {
    console.error("Error creating prduct:", error);
    throw error;
  }
};

export const updateProduct = async (id: String, updateData: updateData) => {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.product;
  } catch (error) {
    console.error("Error updating prduct:", error);
    throw error;
  }
};

export const deleteProduct = async (id: String) => {
  try {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error("Error deleting prduct:", error);
    throw error;
  }
};