import SettingsContainer from "@/components/Settings/SettingsContainer";
import { fetchProducts, getSettings } from "@/lib/PowerHouse";
import { Settings, updateData } from "@/types";
import { Loader2 } from "lucide-react";
import React from "react";

const SettingsPage = async () => {
  const data: Settings | null = (await getSettings()) || null;
  const products: updateData[] = await fetchProducts();

  return (
    <>
      {data ? (
        <main className="pt-5 pb-20 px-[3%] min-h-[100vh]">
          <SettingsContainer data={data} products={products} />
        </main>
      ) : (
        <div className="flex items-center justify-center h-[100vh]">
          <Loader2 size={50} className="animate-spin" color="#F8AF24" />
        </div>
      )}
    </>
  );
};

export default SettingsPage;
