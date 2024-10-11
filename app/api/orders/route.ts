// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { connectToDb } from "@/utils/config/mongodb";
import Order from "@/utils/models/Order";

export async function GET(req: Request) {
  await connectToDb();
  
  try {
    const orders = await Order.find().populate('items.productId');
    return new NextResponse(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Failed to fetch orders" }), { status: 500 });
  }
}