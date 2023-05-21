"use client"

import { CourierProvider } from "@trycourier/react-provider";
import { Toast } from "@trycourier/react-toast";

const CLIENT_KEY = process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY;
const USER_ID = "Github_28081510";

export function Notifications() {

  return (
    <p>
        Hey, I'm a notification!
        <CourierProvider clientKey={CLIENT_KEY} userId={USER_ID}>
            <Toast />
        </CourierProvider>
    </p>
  )
}

export const metadata = {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Server Components",
      "Radix UI",
    ],
    authors: [
      {
        name: "shadcn",
        url: "https://shadcn.com",
      },
    ],
    creator: "shadcn",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl("/og.jpg"),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [`${siteConfig.url}/og.jpg`],
      creator: "@shadcn",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
  }
