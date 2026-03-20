import axios from "axios";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    const buffer = Buffer.from(await file.arrayBuffer());

    const res = await axios.post(
      "https://api.shelby.xyz/v1/blobs",
      buffer,
      {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      }
    );

    return Response.json({
      success: true,
      url: res.data.blob_url,
      hash: res.data.hash,
    });
  } catch (err) {
    return Response.json({
      success: false,
      error: err.message,
    });
  }
}
