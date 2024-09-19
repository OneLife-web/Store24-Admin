"use client";
import { NavLink } from "@/lib/contants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Header = () => {
  const pathName = usePathname();
  return (
    <nav className="py-5 px-[3%] sticky top-[-170px] z-10 bg-white">
      <div className="bg-secondary rounded-xl flex items-center justify-center">
        <Link href="/">
          <Image src="/logo.jpeg" width={150} height={150} alt="logo" priority />
        </Link>
      </div>
      <div className="flex items-center gap-5 text-primary w-fit mx-auto py-5">
        {NavLink.map((nav, i) => (
          <div
            key={i}
            className={cn("w-fit bg-gray-50 rounded-lg p-2", {
              "text-[#F8AF24]": pathName === nav.link,
            })}
          >
            <Link href={nav.link}>{nav.icon}</Link>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Header;
