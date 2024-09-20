import { CreateRequestBody, UpdateRequestBody } from "@/types";
import { connectToDb } from "@/utils/config/mongodb";
import { Settings } from "@/utils/models/Settings";
import { NextRequest, NextResponse } from "next/server";

// POST request for creating a new banner and promotion
export async function POST(request: NextRequest) {
  const body: CreateRequestBody = await request.json();

  try {
    await connectToDb();

    const newSettings = new Settings({
      banner: {
        title: body.bannerTitle,
        link: body.bannerLink,
      },
      promotion: {
        productId: body.productId, // Use productId directly
      },
    });

    // Save the document to the database
    const savedSettings = await newSettings.save();

    return NextResponse.json(
      {
        message: "Banner and promotion created successfully",
        settings: savedSettings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating banner and promotion:", error);
    return NextResponse.json({ error: "Error creating data" }, { status: 500 });
  }
}

// GET request for fetching banner and promotion details
export async function GET() {
  try {
    // Ensure the database connection is established
    await connectToDb();

    // Fetch the settings document (assuming only one document exists)
    const settings = await Settings.findOne().populate({
      path: "promotion.productId", // The path to populate
      select: "title price", // Specify fields to select from the Product model
    });

    // If no settings document exists, return a 404 response
    if (!settings) {
      return NextResponse.json({ error: "No settings found" }, { status: 404 });
    }

    // Return the banner and promotion details with a 200 status
    return NextResponse.json(
      { banner: settings.banner, promotion: settings.promotion },
      { status: 200 }
    );
  } catch (error) {
    // Type guard to check if 'error' has a 'message' property
    if (error instanceof Error) {
      // Log the specific error message for debugging purposes
      console.error("Error fetching settings data:", error.message);

      // Return a 500 error response with the error message
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Handle cases where the error is not an instance of Error
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

// PUT request for updating the banner and promotion details
export async function PUT(request: NextRequest) {
  const body: UpdateRequestBody = await request.json();

  try {
    await connectToDb();

    // Find and update the settings document
    const settings = await Settings.findOneAndUpdate(
      {}, // Assuming you have only one settings document
      {
        $set: {
          "banner.title": body.bannerTitle,
          "banner.link": body.bannerLink,
          "promotion.productId": body.productId, // Update productId directly
        },
      },
      { new: true } // Return the updated document
    );

    if (!settings) {
      return NextResponse.json(
        { error: "No settings found for update" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Settings updated successfully",
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Error updating data" }, { status: 500 });
  }
}
