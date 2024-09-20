import SettingsContainer from "@/components/Settings/SettingsContainer";
import { getSettings } from "@/lib/PowerHouse";
import { Settings } from "@/types";
import React from "react";

const SettingsPage = async () => {
  const data: Settings | null = (await getSettings()) || null;

  if (!data) {
    console.error("Settings data not available");
    return <p>Error loading settings data.</p>;
  }
  return (
    <main className="pt-5 pb-20 px-[3%] min-h-[100vh]">
      <SettingsContainer data={data} />
    </main>
  );
};

export default SettingsPage;
