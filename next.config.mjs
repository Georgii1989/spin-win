/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [],
    },
    turbo: {
        enabled: false,  // Отключаем Turbopack для стабильного билда
    },
};

export default nextConfig;