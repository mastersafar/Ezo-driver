import "./globals.css";
import Header from "@/components/Navigator/header";
import { cookies } from "next/headers"; // Import Next.js headers
import { Cairo } from "next/font/google";

const roboto = Cairo({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-cairo",
});

export const metadata = {
  title: "dummy website",
  description: "this is for isom",
};

export default function RootLayout({ children }) {
  // Check for token in cookies
  const token = cookies().get("token")?.value;

  return (
    <html lang="en" dir="rtl" className={`${roboto.variable} `}>
      <body className="font-cairo">
        {/* Render Header only if token exists */}
        {token && <Header>{children}</Header>}
        
        

        {!token &&<div >
          {children}
        </div>}
      </body>
    </html>
  );
}
