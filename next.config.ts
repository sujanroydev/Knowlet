import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.43.106.115"],

  serverExternalPackages: [
    "@sparticuz/chromium",
    "puppeteer-core",
  ],

  outputFileTracingIncludes: {
    "/api/resources/pdf/*": [
      "node_modules/@sparticuz/chromium/bin/**/*",
    ],
  },

  async redirects() {
    return [
      // aliases
      {
        source: "/sujan",
        destination: "/dev",
        permanent: true,
      },

      // social
      {
        source: "/suhan/fb",
        destination: "https://www.facebook.com/suhan831",
        permanent: true,
      },
      {
        source: "/suhan/yt",
        destination: "https://youtube.com/@currentscope5",
        permanent: true,
      },

      // developer
      {
        source: "/dev",
        destination: "https://sujanroy.in",
        permanent: true,
      },
      {
        source: "/dev/github",
        destination: "https://github.com/sujanroydev",
        permanent: true,
      },
      {
        source: "/dev/linkedin",
        destination: "https://linkedin.com/in/sujanroydev",
        permanent: true,
      },
      {
        source: "/dev/facebook",
        destination: "https://facebook.com/sujanroydev",
        permanent: true,
      },

      // github issues
      {
        source: "/issue",
        destination: "https://github.com/sujanroydev/Knowlet/issues",
        permanent: true,
      },

      // other
      {
        source: "/youtube",
        destination: "https://youtube.com/@knowletofficial",
        permanent: true,
      },
      {
        source: "/facebook",
        destination: "https://facebook.com/@knowletofficial",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
