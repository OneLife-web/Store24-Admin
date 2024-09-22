"use client";

import { useState } from "react";
import Input from "../Input";
import { Loader2 } from "lucide-react";
import { updateSettings } from "@/lib/PowerHouse";
import { Settings, updateData } from "@/types";
import { toast } from "@/hooks/use-toast";
import { ComboboxDemo } from "../ComboBox";

const SettingsContainer = ({
  data,
  products,
}: {
  data: Settings;
  products: updateData[];
}) => {
  if (!data) {
    <div>Loading...</div>;
  }

  const [banner, setBanner] = useState({
    title: data?.banner?.title || "",
    link: data?.banner?.link || "",
  });

  const [productId, setProductId] = useState(
    data?.promotion?.productId?._id || ""
  );

  const [loading, setLoading] = useState(false);

  //handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        bannerTitle: banner.title,
        bannerLink: banner.link,
        productId: productId,
      };
      const res = await updateSettings(payload);
      if (res.status === 200) {
        toast({
          title: "Settings updated",
        });
        setLoading(false);
        // setError("");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast({
        title: "Sorry an error occured",
      });
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div className="bg-gray-50 grid gap-6 py-5 pb-10 p-[3%] rounded-xl w-full">
          <div>
            <label>Top Banner</label>
            <div className="mt-3 grid gap-4">
              <Input
                value={banner.title}
                onChange={(e) =>
                  setBanner((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter Banner Name"
              />
              <Input
                value={banner.link}
                onChange={(e) =>
                  setBanner((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="Enter Banner Link"
              />
            </div>
          </div>
          <div>
            <label>Promotion</label>
            <div className="mt-3">
              <ComboboxDemo
                products={products}
                setId={setProductId}
                id={data?.promotion?.productId?._id}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-secondaryBg flex items-center justify-center mt-5 rounded-full h-[48px] font-medium w-full"
        >
          {loading ? (
            <span className="animate-spin">
              <Loader2 />
            </span>
          ) : (
            <span>Update</span>
          )}
        </button>
      </form>
    </section>
  );
};

export default SettingsContainer;
