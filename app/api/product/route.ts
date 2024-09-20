import { connectToDb } from "@/utils/config/mongodb";
import { Product } from "@/utils/models/Product";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    await connectToDb();
    const newProduct = new Product(data);
    const savedProduct = await newProduct.save();
    return NextResponse.json({ product: savedProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDb();
    const products = await Product.find({});
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}
