import "./globals.css";

export const metadata = {
  title: "AuraAI — The Dream Oracle",
  description: "AI-powered dream analysis and cyber-tarot matrix",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AuraAI",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-void antialiased">{children}</body>
    </html>
  );
}