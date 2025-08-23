import { NextResponse } from "next/server";
import FormData from "form-data";
import fetch from "node-fetch";
import { privateEnv } from "@/env";

export const POST = async (req) => {
  try {
    const formData = new FormData();
    const data = await req.formData();
    const file = data.get("image");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    formData.append("image_file", file.stream(), file.name);

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": privateEnv.REMOVE_BG_API_KEY,
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
