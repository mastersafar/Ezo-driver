/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['dummyimage.com'], // ✅ Replace with actual image domains
    },
    reactStrictMode: true, // ✅ Remove if PWA is complaining
    swcMinify: true,
    experimental: {
      appDir: true, // ✅ Ensure App Router is enabled
    },
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === "development", // ✅ Disable PWA in dev mode
    },
  };
  
  export default nextConfig;
  