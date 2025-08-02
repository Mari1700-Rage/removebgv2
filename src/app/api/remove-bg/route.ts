import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";

export const runtime = "nodejs";

let segmenter: any = null;

async function getSegmenter() {
  if (!segmenter) {
    segmenter = await pipeline("image-segmentation", "briaai/RMBG-1.4");
  }
  return segmenter;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob) || file.size === 0) {
      return NextResponse.json({ error: "Invalid or missing image file" }, { status: 400 });
    }

    const segmenter = await getSegmenter();

    const results = await segmenter(file);

    const alphaMaskedImage = await results[0].blob();

    return new NextResponse(alphaMaskedImage, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (err) {
    console.error("Background removal error:", err);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
