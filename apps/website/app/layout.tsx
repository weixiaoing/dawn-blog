import clsx from "clsx";

import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { JotaiProvider } from "./_components/providers/JotaiProvider"
import "./globals.css"
import ReactQueryProvider from "./utils/Providers/ReactQueryProvider"

import "@arco-design/web-react/dist/css/arco.css"

const roboto_mono = Montserrat({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "Dawnot Blog",
  description: "just do it!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <title>Dawn Blog</title>
      </head>
      <body
        className={clsx(
          // roboto_mono.className,
          "dark:bg-[rgb(48,48,48)] bg-[rgb(254,252,253)]"
        )}
      >
        <Theme>
          {" "}
          <ReactQueryProvider>
            <JotaiProvider>{children}</JotaiProvider>
          </ReactQueryProvider>
        </Theme>
      </body>
    </html>
  )
}
