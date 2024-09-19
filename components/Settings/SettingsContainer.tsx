"use client";

import { useState } from "react";
import Input from "../Input";

const SettingsContainer = () => {
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  return (
    <section className="bg-gray-50 p-5 rounded-xl w-full">
      <form>
        <div>
          <label>Top Banner</label>
          <Input
            value={bannerTitle}
            onChange={(e) => setBannerTitle(e.target.value)}
            className="mt-3"
            placeholder="Enter Title"
          />
          <Input
            value={bannerLink}
            onChange={(e) => setBannerLink(e.target.value)}
            className="mt-3"
            placeholder="Enter Link"
          />
        </div>

        <div></div>
      </form>
    </section>
  );
};

export default SettingsContainer;
