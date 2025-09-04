import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import mdx from "@next/mdx";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

const withMDX = mdx({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  async redirects() {
    return [];
  },
  // Vercel 优化配置
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ['@aws-sdk/client-s3', '@aws-sdk/lib-storage'],
};

// Make sure experimental mdx flag is enabled
const configWithMDX = {
  ...nextConfig,
  experimental: {
    mdxRs: false, // 使用稳定的MDX配置
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(configWithMDX)));
