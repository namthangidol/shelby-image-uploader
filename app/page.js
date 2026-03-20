"use client";

import { useState } from "react";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setLoading(false);

    if (data.url) setImageUrl(data.url);
  };

  return (
    <div style={{ padding: 40 }}>

  {/* LOGO */}
      <img src="/logo.png" width="48"/>
      <h1>Shelby & Blog Nguyen Nam Thang Image Upload</h1>

      <input type="file" onChange={upload} />

      {loading && <p>Uploading...</p>}

      {imageUrl && (
        <div>
          <p>Image URL:</p>
          <a href={imageUrl} target="_blank">{imageUrl}</a>
          <br /><br />
          <img src={imageUrl} width={300} />
        </div>
      )}
    </div>
  );
}
