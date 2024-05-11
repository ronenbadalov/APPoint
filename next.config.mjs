/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qfublamrbi3ixpha.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
