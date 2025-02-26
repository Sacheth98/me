/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  images: {
    unoptimized: true, // Required for static export
  },
  // basePath: "/me", // 🔹 Must match your repository name exactly
  //assetPrefix: "/me/", // 🔹 Ensures assets load correctly
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: ["file-loader"],
    });
    return config;
  },
};
