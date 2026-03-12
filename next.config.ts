import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            new URL('https://inaturalist-open-data.s3.amazonaws.com/photos/**')
        ]
    }
};

export default nextConfig;