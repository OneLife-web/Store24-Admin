"use client";

import { cn } from "@/lib/utils";
import { crumbsType } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Breadcrumb = ({ crumbs }: { crumbs: crumbsType[] }) => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div>
      <Link
        href={crumbs[0].link}
        className={cn("capitalize text-sm text-gray-500", {
          "text-primary font-medium text-base": pathname === crumbs[0].link,
        })}
      >
        {crumbs[0]?.title}
      </Link>
      <span className="mx-3">/</span>
      <Link
        href={crumbs[1].link}
        className={cn("capitalize text-sm text-gray-500", {
          "text-primary font-medium text-base": pathname === crumbs[1].link,
        })}
      >
        {crumbs[1]?.title}
      </Link>
    </div>
  );
};

export default Breadcrumb;
