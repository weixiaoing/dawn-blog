/** @type {import('next').NextConfig} */

import { codeInspectorPlugin } from "code-inspector-plugin"
const nextConfig = {
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.md$/,
        use: "raw-loader",
      }
    )
    config.plugins.push(codeInspectorPlugin({ bundler: "webpack" }))
    return config
  },

  images: {
    remotePatterns: [
      {
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline';",
  },
  basePath: "",
  devIndicators: {
    buildActivityPosition: "bottom-right",
  },
  redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: false,
      },
    ]
  },
}

export default nextConfig;
