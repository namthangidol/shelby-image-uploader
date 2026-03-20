import axios from "axios";
import { ethers } from "ethers";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) throw new Error("No file");

    const buffer = Buffer.from(await file.arrayBuffer());

    const privateKey = process.env.PRIVATE_KEY;
    const apiKey = process.env.API_KEY;

    if (!privateKey) throw new Error("Missing PRIVATE_KEY");

    const wallet = new ethers.Wallet(privateKey);

    // ✅ tên file (QUAN TRỌNG)
    const blobName = file.name || `file_${Date.now()}.png`;

    // ✅ endpoint chuẩn Shelby testnet
    const url = `https://api.shelbynet.shelby.xyz/shelby/v1/blobs/${wallet.address}/${blobName}`;

    // ✅ upload
    await axios.put(
      url,
      buffer,
      {
        headers: {
          "Content-Type": "application/octet-stream",
          ...(apiKey && { "x-api-key": apiKey }),
        },
      }
    );

    return Response.json({
      success: true,
      url: url,
      name: blobName,
      address: wallet.address,
    });

  } catch (err) {
    console.error(err);

    return Response.json({
      success: false,
      error: err.message,
    });
  }
}
