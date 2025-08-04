export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "@huggingface/transformers";

let segmenter: any = null;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob) || file.size === 0) {
      return NextResponse.json({ error: "Invalid or missing image file" }, { status: 400 });
    }

    if (!segmenter) {
      try {
        segmenter = await pipeline("image-segmentation", "briaai/RMBG-1.4");
      } catch (initError) {
        console.error("Failed to initialize segmenter:", initError);
        return NextResponse.json({ error: "Failed to initialize image segmentation model" }, { status: 500 });
      }
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
