import SearchForm from "@/components/SearchForm";
import { fetchProducts } from "@/lib/PowerHouse";
import { updateData } from "@/types";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const ProductPage = async () => {
  const data: updateData[] = await fetchProducts();
  return (
    <main className="pt-5 pb-20 px-[3%] min-h-[100vh]">
      <SearchForm />
      {data ? (
        <div className="bg-gray-50 grid gap-2 rounded-lg p-2 mt-6">
          {data.map((item, i) => (
            <div key={item._id} className="bg-white rounded-lg">
              <div className="border-b h-16 p-2">
                <p key={i}>{item.title}</p>
              </div>
              <div className="h-16 p-2 flex items-center justify-between">
                <p className="text-2xl font-medium">${item.price}.00</p>
                <div className="w-fit grid grid-cols-2 gap-2">
                  <Link href={`/products/edit?id=${item._id}`}>
                    <div className="w-10 h-10 border flex items-center justify-center rounded-lg">
                      <Pencil strokeWidth={1.2} />
                    </div>
                  </Link>
                  <Link href={`/products/edit?id=${item._id}`}>
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                      <Trash2 strokeWidth={1.2} />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 size={50} className="animate-spin" color="#F8AF24" />
        </div>
      )}
    </main>
  );
};

export default ProductPage;
