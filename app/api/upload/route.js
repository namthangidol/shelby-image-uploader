import axios from "axios";
import { ethers } from "ethers";

export async function POST(req) {
  try {
    // 📦 lấy file
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      throw new Error("No file uploaded");
    }

    // 🚫 giới hạn size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("File too large (max 2MB)");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 🔐 ENV
    const privateKey = process.env.PRIVATE_KEY;
    const apiKey = process.env.API_KEY;

    if (!privateKey) {
      throw new Error("Missing PRIVATE_KEY in Vercel");
    }

    // 👛 tạo ví
    const wallet = new ethers.Wallet(privateKey);

    // ✅ FIX QUAN TRỌNG: ký bằng chính address
    const message = wallet.address;
    const signature = await wallet.signMessage(message);

    console.log("Wallet:", wallet.address);

    // 🚀 upload Shelby
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

    console.log("Shelby response:", res.data);

    // ❗ check response
    if (!res.data || !res.data.blob_url) {
      throw new Error("Invalid response from Shelby");
    }

    return Response.json({
      success: true,
      url: res.data.blob_url,
      hash: res.data.hash,
      address: wallet.address, // debug luôn
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err.message);

    return Response.json({
      success: false,
      error: err.message,
    });
  }
}
