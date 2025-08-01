export const runtime = "edge";


import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";

let segmenter: any = null;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "Invalid or missing image file" }, { status: 400 });
    }

    if (!segmenter) {
      segmenter = await pipeline("image-segmentation", "briaai/RMBG-1.4");
    }

    // Run the segmentation pipeline on the image file (Blob)
    const results = await segmenter(file);

    // Get alpha-masked image as Blob
    const alphaMaskedImage = await results[0].blob();

    return new NextResponse(alphaMaskedImage, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (err) {
    console.error("Error during background removal:", err);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
