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
import { Settings } from "@/types";
import { toast } from "@/hooks/use-toast";

const storage = getStorage(app);

const SettingsContainer = ({ data }: { data: Settings }) => {
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
                placeholder="Enter Product Name"
              />
              <Input
                value={banner.link}
                onChange={(e) =>
                  setBanner((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="Enter Product Link"
              />
            </div>
          </div>

          <div>
            <label>Promotion</label>
            <div className="mt-3 grid gap-4">
              <Input
                value={promotion.title}
                onChange={(e) =>
                  setPromotion((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter Title"
              />
              <Input
                value={promotion.link}
                onChange={(e) =>
                  setPromotion((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="Enter Link"
              />

              <div className="mb-5">
                <label>Promotion Product&lsquo;s Features</label>
                <div className="mt-3 grid gap-4">
                  {promotion.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...promotion.features];
                          newFeatures[index] = e.target.value;
                          setPromotion((prev) => ({
                            ...prev,
                            features: newFeatures,
                          }));
                        }}
                        placeholder="Enter feature"
                      />
                      <button
                        type="button"
                        className=""
                        onClick={() => {
                          const newFeatures = promotion.features.filter(
                            (_, i) => i !== index
                          );
                          setPromotion((prev) => ({
                            ...prev,
                            features: newFeatures,
                          }));
                        }}
                      >
                        <Trash2 color="red" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="bg-secondaryBg flex items-center justify-center mt-5 rounded-full h-[48px] font-medium"
                    onClick={() =>
                      setPromotion((prev) => ({
                        ...prev,
                        features: [...prev.features, ""],
                      }))
                    }
                  >
                    Add Feature
                  </button>
                </div>
              </div>

              <div className="relative">
                {uploading && (
                  <div className="absolute z-50 left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] flex items-center justify-center">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 50 50"
                      width="50px"
                      height="50px"
                    >
                      <path
                        fill="none"
                        stroke="#F8AF24"
                        strokeWidth="4"
                        strokeMiterlimit="10"
                        d="M25,5 A20,20 0 1,1 24.999,5"
                        strokeDasharray="31.4 31.4"
                        strokeLinecap="round"
                        transform="rotate(225 25 25)"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0 25 25"
                          to="360 25 25"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>
                  </div>
                )}

                {promotion.imageUrl ? (
                  <div className="relative">
                    <Image
                      src={promotion.imageUrl}
                      width={400}
                      height={200}
                      alt="Uploaded promotion"
                      className="rounded-[10px] w-full min-h-[150px] max-h-[200px]"
                    />
                  </div>
                ) : (
                  <div className="bg-white min-h-[150px] relative rounded-[10px]"></div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const fileInput = document.getElementById(
                      "file-upload"
                    ) as HTMLInputElement | null;
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                  className="absolute right-5 top-5 flex items-center justify-center w-[56px] h-[56px] rounded-full bg-secondaryBg"
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <UploadCloudIcon />
                </button>
              </div>
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
