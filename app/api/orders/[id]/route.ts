import { NextResponse } from "next/server";
import OrderModel from "@/utils/models/Order";
import { connectToDb } from "@/utils/config/mongodb";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDb();

    const { status } = await req.json();

    const order = await OrderModel.findOne({ orderId: params.id });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update the order status
    order.status = status;
    const updatedOrder = await order.save();

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
