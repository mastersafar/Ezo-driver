
import "./globals.css";
import Header from "@/components/Navigator/header";
import NotificationHandler from "@/components/NotificationHandler";

import { cookies } from "next/headers"; // Import Next.js headers
import { Cairo } from "next/font/google";
import PWAInstaller from "@/components/PWAInstaller"; // ✅ Import PWAInstaller
import { Toaster } from "react-hot-toast";

import { registerServiceWorker } from "@/services/firebase";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister"; // ✅ Import the new component



const roboto = Cairo({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-cairo",
});

export const metadata = {
  title: "Ezo Driver",
  description: "This is for Ezo Driver app",
};

export default function RootLayout({ children }) {
  // Check for token in cookies
  const token = cookies().get("token")?.value;
  if(token) 
  console.log(token) ;


  return (
    <html lang="ar" dir="rtl" className={`${roboto.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-cairo">
        <PWAInstaller /> {/* ✅ Ensure PWAInstaller runs globally */}
        <Toaster position="top-right" reverseOrder={false} />

        <NotificationHandler />


        
        {token ? (
          <Header>{children}</Header>
        ) : (
          <div>{children}</div>
        )}
      </body>
    </html>
  );
}
