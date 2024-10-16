"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Loader2,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { UtilityModal } from "./UtiltyModal";
import Image from "next/image";

interface Order {
  _id: string;
  items: { name: string; image: string; price: number; quantity: number }[];
  status: "pending" | "processing" | "completed" | "failed";
  orderId: string;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    street?: string;
    apt?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
  };
  packageInfo?: string;
  total?: number;
  trackingId?: string;
}

interface OrderTableProps {
  orders: Order[];
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="text-xs">#{row.getValue("orderId")}</div>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as {
        name: string;
        image: string;
        price: number;
        quantity: number;
      }[];

      return (
        <div className="w-[300px] grid gap-3">
          {items.map((item) => (
            <div key={item.name} className="text-xs truncate-two-lines">
              {item.name} (Qty: {item.quantity}) - ${item.price.toFixed(2)}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <div
          className={cn("w-fit rounded-full px-[10px] py-[5px]", {
            "bg-[#F8BCBC] font-clashmd text-[10px] md:text-xs text-[#8B1A1A]":
              status === "failed" || status === "completed",
            "bg-[#BAD9F7] font-clashmd text-[10px] md:text-xs text-[#1673CC]":
              status === "pending",
            "bg-[#BAF7BA] font-clashmd text-[10px] md:text-xs text-[#1B691B]":
              status === "processing",
          })}
        >
          {status}
        </div>
      );
    },
    enableSorting: true, // Enable sorting
  },
  {
    accessorKey: "customerDetails",
    header: "Customer",
    cell: ({ row }) => {
      const customerDetails = row.getValue("customerDetails") as {
        firstName: string;
        lastName: string;
      };
      return (
        <div className="text-xs">{`${customerDetails.firstName} ${customerDetails.lastName}`}</div>
      );
    },
  },
];

export function OrderTableDemo({ orders }: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isCustomerModal, setIsCustomerModal] = React.useState(false);
  const [isTrackingModal, setIsTrackingModal] = React.useState(false);
  const [trackingId, setTrackingId] = React.useState(
    selectedOrder?.trackingId || ""
  );
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!trackingId) {
      alert("Please enter a tracking ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: selectedOrder?.orderId, trackingId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setIsTrackingModal(false);
      setTrackingId("");
      alert("Tracking ID updated successfully");
    } catch (error) {
      console.error("Error sending tracking ID:", error);
      // Handle error here, e.g., showing an error toast
    } finally {
      setLoading(false);
    }
  };

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    // Custom filter logic
    globalFilterFn: (row, filterValue) => {
      const orderId = row.getValue("orderId") as string;
      const customerDetails = row.getValue("customerDetails") as {
        firstName: string;
        lastName: string;
      };
      const customerName =
        `${customerDetails.firstName} ${customerDetails.lastName}`.toLowerCase();

      // Allow filtering by orderId or customer name
      return (
        orderId.includes(filterValue.toLowerCase()) ||
        customerName.includes(filterValue.toLowerCase())
      );
    },
  });

  return (
    <div className="w-full">
      <div className="flex gap-3 items-center py-4">
        <Input
          placeholder="Filter order ID, customer names..."
          value={
            (table.getColumn("customerDetails")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("customerDetails")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => setSelectedOrder(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {/* Dropdown Menu for actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => setIsCustomerModal(true)}
                        >
                          View Order details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setIsTrackingModal(true)}
                        >
                          Send Tracking ID
                        </DropdownMenuItem>
                        <DropdownMenuItem>Mark as completed</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {selectedOrder && isCustomerModal && (
        <UtilityModal setOpen={setIsCustomerModal}>
          <div className="bg-white rounded-xl p-3 grid gap-5 py-6 max-h-[80vh] h-full overflow-y-scroll custom-scrollbar">
            <div>
              <h1 className="text-lg font-medium">Order Details</h1>
              <div className="grid gap-3 mt-2">
                <p className="text-sm">Order ID: #{selectedOrder?.orderId}</p>
                <div className="grid gap-3">
                  {selectedOrder?.items.map((item) => (
                    <div key={item.image} className="flex items-center gap-3">
                      <div className="w-fit relative">
                        <Image
                          src={item.image}
                          width={45}
                          height={45}
                          alt="product Image"
                          className="rounded-lg min-w-[45px]"
                        />
                        <div className="size-4 flex items-center justify-center text-[10px] rounded-full bg-black text-white absolute -top-2 -right-2">
                          {item.quantity}
                        </div>
                      </div>
                      <p className="text-xs">
                        {item.name} -{" "}
                        <span className="font-medium">${item.price}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-medium">Customer Details</h1>
              <div className="grid gap-3 mt-2 text-sm">
                <p className="text-sm">
                  Name: {selectedOrder?.customerDetails.firstName}{" "}
                  {selectedOrder?.customerDetails.firstName}
                </p>
                <p className="text-sm">
                  Email : {selectedOrder?.customerDetails.email}
                </p>
                <p className="text-sm">
                  Phone : {selectedOrder?.customerDetails.phone}
                </p>
                <p className="text-sm">
                  Street : {selectedOrder?.customerDetails.street}
                </p>
                <p className="text-sm">
                  Country : {selectedOrder?.customerDetails.country}
                </p>
                <p className="text-sm">
                  State : {selectedOrder?.customerDetails.state}
                </p>
                <p className="text-sm">
                  City : {selectedOrder?.customerDetails.city}
                </p>
                {selectedOrder?.customerDetails.apt && (
                  <p className="text-sm">
                    Apt : {selectedOrder?.customerDetails.apt}
                  </p>
                )}
                <p className="text-sm">
                  Zip Code : {selectedOrder?.customerDetails.zip}
                </p>
              </div>
            </div>
            <p className="font-medium">Total Spent: ${selectedOrder.total}</p>
          </div>
        </UtilityModal>
      )}
      {selectedOrder && isTrackingModal && (
        <UtilityModal setOpen={setIsTrackingModal}>
          <div className="bg-white rounded-xl p-3 grid gap-5 py-10 min-w-[80vw] md:min-w-[50vw] max-h-[80vh] h-full overflow-y-scroll">
            <Input
              defaultValue={
                selectedOrder?.trackingId !== ""
                  ? selectedOrder.trackingId
                  : trackingId
              }
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Tracking ID"
              className="h-[46px]"
            />
            <button
              onClick={handleSubmit}
              className="w-full rounded-lg bg-secondaryBg flex items-center justify-center font-medium h-[46px]"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Send"}
            </button>
          </div>
        </UtilityModal>
      )}
    </div>
  );
}
