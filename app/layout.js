import "./globals.css";

export const metadata = {
  title: "Sürpriz 🎂",
  description: "Bir sürpriz seni bekliyor...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
