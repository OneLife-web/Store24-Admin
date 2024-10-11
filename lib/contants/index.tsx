import { FolderKanban, House, Settings, ShoppingCart, UsersRound } from "lucide-react";

export const NavLink = [
  { icon: <House strokeWidth={1.2} />, link: "/" },
  { icon: <FolderKanban strokeWidth={1.2} />, link: "/products" },
  { icon: <ShoppingCart strokeWidth={1.2} />, link: "/orders" },
  { icon: <UsersRound strokeWidth={1.2} />, link: "/users" },
  { icon: <Settings strokeWidth={1.2} />, link: "/settings" },
];
