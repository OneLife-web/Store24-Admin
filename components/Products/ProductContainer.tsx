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
import { Loader2, Plus, Trash2, UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const storage = getStorage(app);

const ProductContainer = () => {
  /* if (!data) {
    <div>Loading...</div>;
  } */

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState<number | undefined>(
    undefined
  );
  const [productImages, setProductImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [whyYouNeedThis, setWhyYouNeedThis] = useState([
    { title: "", content: "" },
  ]);
  const [characteristics, setCharacteristics] = useState([
    { title: "", content: "" },
  ]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  //const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle file change and upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const files = Array.from(target.files);
    setUploading(true);

    const uploadPromises = files.map(async (file) => {
      const fileRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Upload error:", error);
            reject(error);
            setUploading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(fileRef);
            resolve(downloadURL);
          }
        );
      });
    });

    try {
      const imageUrls = await Promise.all(uploadPromises);
      setProductImages((prev) => [...prev, ...imageUrls]);
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploading(false);
    }
  };
  //handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        /*  bannerTitle: banner.title,
        bannerLink: banner.link,
        promotionTitle: promotion.title,
        promotionLink: promotion.link,
        promotionImageUrl: promotion.imageUrl,
        promotionFeatures: promotion.features, */
      };
      /* const res = await updateSettings(payload);
      if (res.status === 200) {
        toast({
          title: "Settings updated",
        });
        setLoading(false);
        // setError("");
      } */
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
        <div className="bg-gray-50 grid gap-6 py-5 mt-5 pb-10 p-[3%] rounded-xl w-full">
          <div>
            <label>Product Basic Info</label>
            <div className="mt-3 grid gap-4">
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter Product Name"
              />
              <Input
                value={
                  productPrice !== undefined ? productPrice.toString() : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = parseFloat(value);
                  setProductPrice(isNaN(parsedValue) ? undefined : parsedValue);
                }}
                placeholder="Enter Product Price"
              />
            </div>
          </div>
          <div className="relative">
            <label>Product&lsquo;s Features</label>
            <div className="mt-3 grid gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      newFeatures[index] = e.target.value; // Update feature at the specific index
                      setFeatures(newFeatures); // Update the whole array
                    }}
                    placeholder="Enter feature"
                  />
                  <button
                    type="button"
                    className=""
                    onClick={() => {
                      const newFeatures = features.filter(
                        (_, i) => i !== index
                      ); // Remove feature at the specific index
                      setFeatures(newFeatures); // Update the whole array after deletion
                    }}
                  >
                    <Trash2 color="red" size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-secondaryBg flex items-center justify-center absolute top-[-15px] right-0 w-[25px] mt-5 rounded-full h-[25px] font-medium"
                onClick={() => setFeatures([...features, ""])} // Add an empty string to the features array
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
          <div className="relative">
            <label>Why You Need This</label>
            <div className="mt-3 grid gap-4">
              {whyYouNeedThis.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...whyYouNeedThis];
                      newItems[index].title = e.target.value; // Update title
                      setWhyYouNeedThis(newItems);
                    }}
                    placeholder="Enter title"
                  />
                  <Input
                    value={item.content}
                    onChange={(e) => {
                      const newItems = [...whyYouNeedThis];
                      newItems[index].content = e.target.value; // Update content
                      setWhyYouNeedThis(newItems);
                    }}
                    placeholder="Enter content"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = whyYouNeedThis.filter(
                        (_, i) => i !== index
                      );
                      setWhyYouNeedThis(newItems);
                    }}
                  >
                    <Trash2 color="red" size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-secondaryBg flex items-center justify-center absolute top-[-15px] right-0 w-[25px] mt-5 rounded-full h-[25px] font-medium"
                onClick={() =>
                  setWhyYouNeedThis([
                    ...whyYouNeedThis,
                    { title: "", content: "" },
                  ])
                }
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
          <div className="relative">
            <label>Characteristics</label>
            <div className="mt-3 grid gap-4">
              {characteristics.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...characteristics];
                      newItems[index].title = e.target.value; // Update title
                      setCharacteristics(newItems);
                    }}
                    placeholder="Enter title"
                  />
                  <Input
                    value={item.content}
                    onChange={(e) => {
                      const newItems = [...characteristics];
                      newItems[index].content = e.target.value; // Update content
                      setCharacteristics(newItems);
                    }}
                    placeholder="Enter content"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = characteristics.filter(
                        (_, i) => i !== index
                      );
                      setCharacteristics(newItems);
                    }}
                  >
                    <Trash2 color="red" size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-secondaryBg flex items-center justify-center absolute top-[-15px] right-0 w-[25px] mt-5 rounded-full h-[25px] font-medium"
                onClick={() =>
                  setCharacteristics([
                    ...characteristics,
                    { title: "", content: "" },
                  ])
                }
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
          <div className="relative">
            <label>FAQs</label>
            <div className="mt-3 grid gap-4">
              {faqs.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...faqs];
                      newItems[index].question = e.target.value; // Update question
                      setFaqs(newItems);
                    }}
                    placeholder="Enter question"
                  />
                  <Input
                    value={item.answer}
                    onChange={(e) => {
                      const newItems = [...faqs];
                      newItems[index].answer = e.target.value; // Update answer
                      setFaqs(newItems);
                    }}
                    placeholder="Enter answer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = faqs.filter((_, i) => i !== index);
                      setFaqs(newItems);
                    }}
                  >
                    <Trash2 color="red" size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-secondaryBg flex items-center justify-center absolute top-[-15px] right-0 w-[25px] mt-5 rounded-full h-[25px] font-medium"
                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between w-full">
              <label>Product Images</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                  className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-secondaryBg"
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple // Allow multiple file uploads
                    onChange={handleFileChange}
                  />
                  <UploadCloudIcon />
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-4 relative pt-2">
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

              {/* Display uploaded images */}
              <div className="grid grid-cols-3 gap-4">
                {productImages.map((url, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg overflow-hidden"
                  >
                    <Image
                      src={url}
                      width={400}
                      height={200}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-full h-[150px] object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProductImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      &times; {/* Close button */}
                    </button>
                  </div>
                ))}
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

export default ProductContainer;
