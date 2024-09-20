"use client";
import { useState } from "react";
import Input from "./Input";
import { Plus, Search } from "lucide-react";

const SearchForm = () => {
  const [query, setQuery] = useState("");
  return (
    <div className="flex items-center gap-3 min-w-full">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        icon={<Search strokeWidth={1.2} />}
        className="border"
      />
      <button className="bg-secondaryBg w-fit inline-block rounded-lg p-1">
        <Plus />
      </button>
    </div>
  );
};

export default SearchForm;
