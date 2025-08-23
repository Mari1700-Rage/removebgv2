import { NextResponse } from "next/server";
import { privateEnv } from "@/env"; // import your private env
import FormData from "form-data";
import fetch from "node-fetch";

export const POST = async (req) => {
  try {
    const formData = new FormData();

    // Read file from request
    const file = await req.formData(); // if using fetch with multipart/form-data
    const imageFile = file.get("image");

    if (!imageFile) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    formData.append("image_file", imageFile.stream(), imageFile.name);

    // Call your background remover API securely with private API key
    const response = await fetch(
"https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": privateEnv.API_KEY, // never exposed to frontend
      },
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: { "Content-Type": "image/png" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
