"use client"; // ✅ Ensure this runs only in the client

import { useEffect } from "react";
import { registerServiceWorker } from "@/services/firebase";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null; // No UI needed, just runs in the background
}
