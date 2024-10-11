// app/api/orders/[orderId]/route.ts
import { NextResponse } from "next/server";
import { connectToDb } from "@/utils/config/mongodb";
import Order from "@/utils/models/Order";

export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
  await connectToDb();
  
  try {
    const { status } = await req.json(); // Get the new status from the request body
    const updatedOrder = await Order.findByIdAndUpdate(params.orderId, { orderStatus: status }, { new: true });
    
    if (!updatedOrder) {
      return new NextResponse(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(updatedOrder), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Failed to update order status" }), { status: 500 });
  }
}