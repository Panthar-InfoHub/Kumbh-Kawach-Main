/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "**",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "suraksha.pantharinfohub.com",
                pathname: "/", // Allow all paths under this domain
            },
            {
                protocol: "https",
                hostname: "www.suraksha.pantharinfohub.com",
                pathname: "/", // Allow all paths under this domain
            },
            {
                protocol: "http", // For development on localhost
                hostname: "localhost",
                port: "3000", // Specify the port for localhost
                pathname: "/**", // Allow all paths under localhost
            },
            {
                protocol: "http", // For development on localhost
                hostname: "localhost",
                port: "3001", // Specify the port for localhost
                pathname: "/**", // Allow all paths under localhost
            },
            {
                protocol: "https",
                hostname: "maps.googleapis.com",
                pathname: "/**"
            },
        ],
        domains: [
            "suraksha.pantharinfohub.com",
            "www.suraksha.pantharinfohub.com",
            "localhost",
            "lh3.googleusercontent.com",
            "maps.googleapis.com"
        ], // Allow localhost during development
        formats: ["image/webp", "image/avif"], // Use modern formats
        deviceSizes: [640, 768, 1024, 1280, 1600], // Optimize for common breakpoints
        imageSizes: [16, 32, 48, 64, 96], // Small sizes for icons or thumbnails
    },
    reactStrictMode: true, // Enforce best practices during development
};

export default nextConfig;