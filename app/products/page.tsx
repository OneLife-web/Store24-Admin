import SearchForm from "@/components/SearchForm";
import { fetchProducts } from "@/lib/PowerHouse";
import { updateData } from "@/types";
import { Loader2 } from "lucide-react";

import ProductCard from "@/components/Products/ProductCard";

const ProductPage = async () => {
  const data: updateData[] = await fetchProducts();
  return (
    <main className="pt-5 pb-20 px-[3%] min-h-[100vh]">
      <SearchForm />
      {data ? (
        data.reverse().length > 0 ? (
          <div className="bg-gray-50 grid gap-2 rounded-lg p-2 mt-6">
            {data.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="h-[50vh] flex items-center justify-center">
            <p>No Products</p>
          </div>
        )
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 size={50} className="animate-spin" color="#F8AF24" />
        </div>
      )}
    </main>
  );
};

export default ProductPage;
