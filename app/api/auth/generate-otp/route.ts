import { NextResponse } from "next/server";
import { generateOTP } from "@/services/otpService";
import { connectToDb } from "@/utils/config/mongodb";

export async function POST(req: Request) {
  await connectToDb(); // Ensure the MongoDB connection is established

  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    const result = await generateOTP(phone);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error generating OTP" },
      { status: 500 }
    );
  }
}
