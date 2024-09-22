import { NextResponse } from "next/server";
import { connectToDb } from "@/utils/config/mongodb";
import { verifyOTP } from "@/services/otpService";

export async function POST(req: Request) {
  await connectToDb(); // Ensure the MongoDB connection is established

  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    const result = await verifyOTP(phone, otp);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Error verifying OTP" },
      { status: 500 }
    );
  }
}
