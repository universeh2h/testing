/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint : {
        ignoreDuringBuilds : true
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output : "export",
    images: {
        remotePatterns: [
            {
                hostname: 'res.cloudinary.com',
            }
        ]
    }
};

export default nextConfig;
