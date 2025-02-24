module.exports = {
  output: "export",
  images: {
    unoptimized: true, // Required for static export
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: ["file-loader"],
    });
    return config;
  },
};
