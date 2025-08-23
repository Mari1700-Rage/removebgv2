import { privateEnv } from "@/env";

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Prepare the form data for Remove.bg API
    const removeBgFormData = new FormData();
    removeBgFormData.append("image_file", file.stream(), file.name);

    // Native fetch works in Next.js API routes
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": privateEnv.REMOVE_BG_API_KEY,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const text = await response.text();
      return new Response(JSON.stringify({ error: text }), { status: response.status, headers: { "Content-Type": "application/json" } });
    }

    const buffer = await response.arrayBuffer();
    return new Response(buffer, {
      status: 200,
      headers: { "Content-Type": "image/png" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
