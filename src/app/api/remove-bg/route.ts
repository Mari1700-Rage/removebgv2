// app/api/remove-bg/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";

let segmenter: any = null;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No image file provided" }, { status: 400 });
  }

  try {
    if (!segmenter) {
      segmenter = await pipeline("image-segmentation", "briaai/RMBG-1.4");
    }

    const results = await segmenter(file);
    const alphaMaskedImage = await results[0].blob(); // background removed PNG

    return new NextResponse(alphaMaskedImage, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (err) {
    console.error("Error during background removal:", err);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
