import { connectToDb } from "@/utils/config/mongodb";
import OrderModel from "@/utils/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDb();
    const orders = await OrderModel.find({});

    if (!orders) {
      return NextResponse.json({ error: "No product found" }, { status: 404 });
    }

    return NextResponse.json({ orders: orders, status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}
