import { FolderKanban, House, Settings, ShoppingCart } from "lucide-react";

export const NavLink = [
  { icon: <House strokeWidth={1.2} />, link: "/" },
  { icon: <FolderKanban strokeWidth={1.2} />, link: "/products" },
  { icon: <ShoppingCart strokeWidth={1.2} />, link: "/users" },
  { icon: <Settings strokeWidth={1.2} />, link: "/settings" },
];
