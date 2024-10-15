"use client";

import { useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
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
import { createProduct, updateProduct } from "@/lib/PowerHouse";
import { ReviewProps, updateData } from "@/types";
import { CountryList } from "../CountryList";

const storage = getStorage(app);

const ProductContainer = ({
  type,
  data,
}: {
  type: string;
  data: updateData;
}) => {
  const [productName, setProductName] = useState(data?.title || "");
  const [productDescription, setProductDescription] = useState(
    data?.description || ""
  );
  const [reviews, setReviews] = useState<ReviewProps[]>(data?.reviews || []);
  const [quantitySold, setQuantitySold] = useState(data?.quantitySold || "");
  const [error, setError] = useState("");
  const [productPrice, setProductPrice] = useState<number | undefined>(
    data?.price || undefined
  );
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(
    data?.discountPrice || undefined
  );
  const [productImages, setProductImages] = useState<
    { url: string; caption?: string }[]
  >(data?.images || []);
  const [productImages2, setProductImages2] = useState<string[]>(
    data?.descriptionImages || []
  );
  const [features, setFeatures] = useState<string[]>(data?.features || [""]);
  const [colors, setColors] = useState<string[]>(data?.colors || [""]);

  const [whyYouNeedThis, setWhyYouNeedThis] = useState(
    data?.whyNeedThis || [{ title: "", content: "" }]
  );
  const [characteristics, setCharacteristics] = useState(
    data?.characteristics || [{ title: "", content: "" }]
  );
  const [faqs, setFaqs] = useState(
    data?.faqs || [{ question: "", answer: "" }]
  );

  //const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImagess] = useState(false);

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return; // Dropped outside the list

    const reorderedImages = [...productImages];
    const [movedImage] = reorderedImages.splice(source.index, 1); // Remove the dragged image
    reorderedImages.splice(destination.index, 0, movedImage); // Insert it at the drop location

    setProductImages(reorderedImages); // Update state with the new image order
  };

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

      return new Promise<{ url: string; caption: string }>(
        (resolve, reject) => {
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
              resolve({ url: downloadURL, caption: "" });
            }
          );
        }
      );
    });

    try {
      const uploadedImages = await Promise.all(uploadPromises);
      setProductImages((prev) => [...prev, ...uploadedImages]);
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange2 = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const files = Array.from(target.files);
    setUploadingImagess(true);

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
            setUploadingImagess(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(fileRef);
            resolve(downloadURL);
          }
        );
      });
    });

    try {
      const uploadedImages = await Promise.all(uploadPromises);
      setProductImages2((prev) => [...prev, ...uploadedImages]);
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploadingImagess(false);
    }
  };

  const index = 0;

  const handleCountrySelect = (country: string | undefined) => {
    const newReviews = [...reviews];

    // Directly access the property without optional chaining
    if (newReviews[index]) {
      newReviews[index].country = country; // Update country with selected value
    }

    setReviews(newReviews);
  };

  //handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "create") {
      setLoading(true);
      if (
        !productImages ||
        !productName ||
        !productPrice ||
        !features ||
        !whyYouNeedThis ||
        !characteristics ||
        !faqs
      ) {
        setError("All fields are required");
      } else {
        try {
          const payload = {
            images: productImages,
            descriptionImages: productImages2,
            title: productName,
            quantitySold,
            description: productDescription,
            price: productPrice,
            discountPrice,
            features,
            colors,
            whyNeedThis: whyYouNeedThis,
            characteristics,
            faqs,
            reviews,
          };
          const res = await createProduct(payload);
          if (res.status === 200) {
            toast({
              title: "Product created",
            });
            setLoading(false);
            setError("");
            setProductImages([]);
            setFeatures([""]);
            setCharacteristics([{ title: "", content: "" }]);
            setWhyYouNeedThis([{ title: "", content: "" }]);
            setFaqs([{ question: "", answer: "" }]);
            setProductPrice(undefined);
            setProductName("");
          }

          // Reset the file input value
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          // Reset the file input value
          if (fileInputRef2.current) {
            fileInputRef2.current.value = "";
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
          setError("");
          toast({
            title: "Sorry an error occured",
          });
        }
      }
    } else {
      setLoading(true);
      try {
        const payload = {
          images: productImages,
          descriptionImages: productImages2,
          title: productName,
          quantitySold,
          description: productDescription,
          price: productPrice,
          discountPrice,
          features,
          colors,
          whyNeedThis: whyYouNeedThis,
          characteristics,
          faqs,
          reviews,
        };

        if (!data._id) {
          toast({
            title: "Product ID is missing",
          });
          throw new Error("Product ID is missing");
        }

        const res = await updateProduct(data._id, payload);
        if (res.status === 200) {
          toast({
            title: "Product updated",
          });
          setLoading(false);
          setError("");
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError("");
        toast({
          title: "Sorry an error occured",
        });
      }
    }
  };
  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div className="bg-gray-50 grid gap-6 py-5 mt-5 pb-10 p-[3%] rounded-xl w-full">
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <div>
            <div className="mt-3 grid gap-4">
              <label>Product Name</label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter Product Name"
              />
              <label>Product Description</label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Enter Product Description"
                className="rounded-lg h-[120px] py-3 custom-scrollbar block w-full px-4 focus:outline-none text-sm placeholder:font-light"
              ></textarea>
              <label>Quantity Sold</label>
              <Input
                value={quantitySold}
                onChange={(e) => setQuantitySold(e.target.value)}
                placeholder="Enter Quantity Sold"
              />
              <label>Product Price</label>
              <Input
                value={
                  productPrice !== undefined ? productPrice.toString() : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = parseFloat(value);
                  setProductPrice(isNaN(parsedValue) ? undefined : parsedValue);
                }}
                placeholder="Enter Product price"
              />
              <label>Discounted Price</label>
              <Input
                value={
                  discountPrice !== undefined ? discountPrice.toString() : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = parseFloat(value);
                  setDiscountPrice(
                    isNaN(parsedValue) ? undefined : parsedValue
                  );
                }}
                placeholder="Enter the discounted price (if applicable)"
              />
            </div>
          </div>
          <div className="relative">
            <label>Product&lsquo;s Colors</label>
            <div className="mt-3 grid gap-4">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={color}
                    onChange={(e) => {
                      const newColors = [...colors];
                      newColors[index] = e.target.value; // Update feature at the specific index
                      setColors(newColors); // Update the whole array
                    }}
                    placeholder="Enter color"
                  />
                  <button
                    type="button"
                    className=""
                    onClick={() => {
                      const newColors = colors.filter((_, i) => i !== index); // Remove feature at the specific index
                      setColors(newColors); // Update the whole array after deletion
                    }}
                  >
                    <Trash2 color="red" size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-secondaryBg flex items-center justify-center absolute top-[-15px] right-0 w-[25px] mt-5 rounded-full h-[25px] font-medium"
                onClick={() => setColors([...colors, ""])} // Add an empty string to the features array
              >
                <Plus size={13} />
              </button>
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
            <label>Specifications</label>
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
                    value={item.answer}
                    onChange={(e) => {
                      const newItems = [...faqs];
                      newItems[index].answer = e.target.value; // Update answer
                      setFaqs(newItems);
                    }}
                    placeholder="Enter answer"
                  />
                  <Input
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...faqs];
                      newItems[index].question = e.target.value; // Update question
                      setFaqs(newItems);
                    }}
                    placeholder="Enter question"
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
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-secondaryBg"
                >
                  <input
                    type="file"
                    id="file-upload"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                  <UploadCloudIcon />
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-4 relative pt-2">
              {uploading && (
                <div className="absolute z-50 left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] flex items-center justify-center">
                  {/* Loading spinner */}
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
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="image-grid" direction="horizontal">
                  {(provided) => (
                    <div
                      className="grid grid-cols-3 gap-4"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {productImages.map((image, index) => (
                        <Draggable
                          key={`image-${index}`}
                          draggableId={`image-${index}`} // Ensure this ID is unique
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="relative grid gap-2 rounded-lg overflow-hidden"
                            >
                              <Image
                                src={image.url}
                                width={100}
                                height={100}
                                alt={`Uploaded image ${index + 1}`}
                                className="w-full h-[100px] object-contain"
                              />
                              <Input
                                value={image.caption || ""}
                                onChange={(e) => {
                                  const updatedImages = [...productImages];
                                  updatedImages[index].caption = e.target.value;
                                  setProductImages(updatedImages);
                                }}
                                placeholder="Enter image caption"
                                className="w-full p-2 bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setProductImages((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  );
                                }}
                                className="absolute right-2 top-2 p-1 bg-red-500 rounded-full"
                              >
                                <Trash2 size={12} className="text-white" />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between w-full">
              <label>Description Images</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("file-upload2")?.click()
                  }
                  className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-secondaryBg"
                >
                  <input
                    type="file"
                    id="file-upload2"
                    ref={fileInputRef2} // Attach the ref here
                    className="hidden"
                    multiple // Allow multiple file uploads
                    onChange={handleFileChange2}
                  />
                  <UploadCloudIcon />
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-4 relative pt-2">
              {uploadingImages && (
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
                {productImages2.map((image, index) => (
                  <div
                    key={index}
                    className="relative grid gap-2 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      width={100}
                      height={100}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-full h-[100px] object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProductImages2((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                      className="absolute right-2 top-2 p-1 bg-red-500 rounded-full"
                    >
                      <Trash2 size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            <label>Reviews</label>
            <div className="mt-3 grid lg:gap-4">
              {reviews.map((review, index) => (
                <div key={index} className="grid grid-cols-2 gap-5">
                  <Input
                    value={review.name}
                    onChange={(e) => {
                      const newReviews = [...reviews];
                      newReviews[index].name = e.target.value;
                      setReviews(newReviews);
                    }}
                    placeholder="Enter reviewer's name"
                  />
                  <Input
                    value={review.comment}
                    onChange={(e) => {
                      const newReviews = [...reviews];
                      newReviews[index].comment = e.target.value;
                      setReviews(newReviews);
                    }}
                    placeholder="Enter review comment"
                  />
                  <Input
                    value={review.date}
                    onChange={(e) => {
                      const newReviews = [...reviews];
                      newReviews[index].date = e.target.value;
                      setReviews(newReviews);
                    }}
                    placeholder="Enter review date (October 10, 2023)"
                  />
                  <Input
                    value={
                      review.rating !== undefined
                        ? review.rating.toString()
                        : "0"
                    }
                    onChange={(e) => {
                      const newReviews: ReviewProps[] = [...reviews];

                      // Get the input value and ensure it is a valid number
                      const value = e.target.value;

                      // Convert to number or default to 0 if invalid
                      const numericValue = value ? Number(value) : 0;
                      newReviews[index].rating = numericValue;

                      // Check if the rating is within the valid range
                      if (numericValue < 1 || numericValue > 5) {
                        newReviews[index].rating = 0; // Reset or handle as needed
                      }

                      setReviews(newReviews);
                    }}
                    placeholder="Enter review rating (1-5)"
                  />
                  <CountryList
                    selectedCountry={review.country}
                    setSelectedCountry={handleCountrySelect}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newReviews = reviews.filter((_, i) => i !== index);
                      setReviews(newReviews);
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
                  setReviews([
                    ...reviews,
                    {
                      name: "",
                      comment: "",
                      date: "",
                      rating: 0, // Initialize rating as a number
                      country: "",
                    },
                  ])
                }
              >
                <Plus size={13} />
              </button>
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
            <span>{type === "create" ? "Create" : "Update"}</span>
          )}
        </button>
      </form>
    </section>
  );
};

export default ProductContainer;
