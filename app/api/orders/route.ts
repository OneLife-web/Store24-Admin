import { connectToDb } from "@/utils/config/mongodb";
import { sendTrackingEmail } from "@/utils/emailService";
import OrderModel from "@/utils/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { orderId, trackingId } = await request.json();

  try {
    // Find the order by orderId
    const order = await OrderModel.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update the order with the tracking ID
    order.trackingId = trackingId;
    await order.save();

    // Send the tracking email to the customer
    await sendTrackingEmail(order.customerDetails.email, trackingId);
    return NextResponse.json({
      message: "Tracking ID updated and email sent.",
    });
  } catch (error) {
    console.error("Error updating order or sending email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
