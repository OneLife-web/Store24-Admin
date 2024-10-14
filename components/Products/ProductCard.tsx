"use client";
import { updateData } from "@/types";
import Modal from "@/components/modal";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { deleteProduct } from "@/lib/PowerHouse";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const ProductCard = ({ item }: { item: updateData }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteProduct(item?._id);
      if (res.status === 200) {
        toast({
          title: "Product deleted",
        });
        setLoading(false);
        setOpen(false);
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Sorry. An error occured",
      });
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="border-b h-16 m-2">
        <p className="truncate-two-lines">{item.title}</p>
      </div>
      <div className="h-16 p-2 flex items-center justify-between">
        <p className="text-2xl font-medium">${item.price}.00</p>
        <div className="w-fit grid grid-cols-2 gap-2">
          <Link href={`/products/edit?id=${item._id}`}>
            <div className="w-10 h-10 border flex items-center justify-center rounded-lg">
              <Pencil strokeWidth={1.2} />
            </div>
          </Link>
          <Modal
            loading={loading}
            open={open}
            setOpen={setOpen}
            onclick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
