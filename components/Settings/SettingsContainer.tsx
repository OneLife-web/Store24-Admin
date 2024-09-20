"use client";

import { useState } from "react";
import Input from "../Input";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";
import { Loader2, Trash2, UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import { updateSettings } from "@/lib/PowerHouse";
import { Settings, updateData } from "@/types";
import { toast } from "@/hooks/use-toast";
import { ComboboxDemo } from "../ComboBox";

const storage = getStorage(app);

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

  const [promotion, setPromotion] = useState({
    title: data?.promotion?.title || "",
    link: data?.promotion?.link || "",
    imageUrl: data?.promotion?.imageUrl || "",
    features: data?.promotion?.features || [], // Add features here
  });

  //const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle file change and upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const file = target.files[0];
    setUploading(true);

    try {
      const fileRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(fileRef);
          setPromotion((prev) => ({ ...prev, imageUrl: downloadURL }));
          setUploading(false);
        }
      );
    } catch (error) {
      console.error("File upload failed:", error);
      setUploading(false);
    }
  };

  //handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        bannerTitle: banner.title,
        bannerLink: banner.link,
        promotionTitle: promotion.title,
        promotionLink: promotion.link,
        promotionImageUrl: promotion.imageUrl,
        promotionFeatures: promotion.features,
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
              <ComboboxDemo />
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
