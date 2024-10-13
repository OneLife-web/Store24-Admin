"use client";

import * as React from "react";
import {
  flexRender,
  useReactTable,
  ColumnDef,
  getCoreRowModel,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CartItem } from "@/types";

// The order data structure
export interface Order {
  _id: string;
  items: { name: string; image: string; price: number; quantity: number }[];
  status: "pending" | "processing" | "completed" | "failed";
  orderId: string;
  customerDetails: { firstName: string; lastName: string; email: string };
}

interface Customer {
  firstName: string;
  lastName: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
}

interface OrderTableProps {
  orders: Order[];
}

// Memoize Columns Definition
export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => <span>{row.getValue("orderId")}</span>,
  },
  {
    accessorKey: "customerDetails",
    header: "Username",
    cell: ({ row }) => {
      const customer: Customer = row.getValue("customerDetails");
      return (
        <span>
          {customer.firstName} {customer.lastName}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("status")}</span>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items: CartItem[] = row.getValue("items");
      return (
        <div>
          {items.map((item, index: number) => (
            <p key={index}>
              {item.name} (x{item.quantity})
            </p>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Order</DropdownMenuItem>
            <DropdownMenuItem>Cancel Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Table Component with Search
export function OrderTableDemo({ orders }: OrderTableProps) {
  // State for search input
  const [search, setSearch] = React.useState("");

  // Memoize the filtered orders based on search input
  const filteredOrders = React.useMemo(() => {
    return orders.filter(
      (order) =>
        order.customerDetails.firstName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.customerDetails.lastName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.orderId.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  // Memoize table configuration
  const table = useReactTable({
    data: filteredOrders, // Use filtered orders instead of full orders list
    columns,
    getCoreRowModel: getCoreRowModel(), // Correctly use getCoreRowModel
  });

  return (
    <div className="rounded-md border">
      {/* Search Input */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full rounded-md"
        />
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
