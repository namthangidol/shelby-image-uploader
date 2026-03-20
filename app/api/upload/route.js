import axios from "axios";
import { ethers } from "ethers";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      throw new Error("No file");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ENV
    const privateKey = process.env.PRIVATE_KEY;
    const apiKey = process.env.API_KEY;

    if (!privateKey) {
      throw new Error("Missing PRIVATE_KEY");
    }

    const wallet = new ethers.Wallet(privateKey);

    // ký message (quan trọng)
    const message = "Upload to Shelby";
    const signature = await wallet.signMessage(message);

    const res = await axios.post(
      "https://api.shelby.xyz/v1/blobs",
      buffer,
      {
        headers: {
          "Content-Type": "application/octet-stream",
          "x-signature": signature,
          "x-address": wallet.address,
          ...(apiKey && { "x-api-key": apiKey }),
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
