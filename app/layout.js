export const metadata = {
  title: "Shelby & Blog Nguyen Nam Thang Image Uploader",
  description: "Upload images to Shelby testnet",
};

 export const metadata = {
  title: "Shelby Image Uploader",
  description: "Upload images to Shelby testnet",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
