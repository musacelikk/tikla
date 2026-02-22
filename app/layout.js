import "./globals.css";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata = {
  title: "Sürpriz 🎂",
  description: "Bir sürpriz seni bekliyor...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={playfair.variable}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
