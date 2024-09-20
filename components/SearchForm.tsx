"use client";
import { useState } from "react";
import Input from "./Input";
import { Plus, Search } from "lucide-react";

const SearchForm = () => {
  const [query, setQuery] = useState("");
  return (
    <div className="flex items-center justify-between gap-3 w-full">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        icon={<Search strokeWidth={1.2} />}
        className="border pl-12"
      />
      <button className="bg-secondaryBg flex items-center justify-center w-[70px] rounded-lg h-[48px]">
        <Plus />
      </button>
    </div>
  );
};

export default SearchForm;
