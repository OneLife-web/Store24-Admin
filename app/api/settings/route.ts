import { CreateRequestBody, UpdateRequestBody } from "@/types";
import { connectToDb } from "@/utils/config/mongodb";
import { IBanner, IPromotion, Settings } from "@/utils/models/Settings";
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
        title: body.promotionTitle,
        link: body.promotionLink,
        imageUrl: body.promotionImageUrl,
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
    await connectToDb();

    const settings = await Settings.findOne(); // Fetch the single settings document

    if (!settings) {
      return NextResponse.json({ error: "No settings found" }, { status: 404 });
    }

    return NextResponse.json(
      { banner: settings.banner, promotion: settings.promotion },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching settings data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
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
          "promotion.title": body.promotionTitle,
          "promotion.link": body.promotionLink,
          "promotion.imageUrl": body.promotionImageUrl,
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

    return NextResponse.json(
      { banner: settings.banner, promotion: settings.promotion },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Error updating data" }, { status: 500 });
  }
}
