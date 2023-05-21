"use client"

// ts-nocheck

import { Inter as FontSans } from "next/font/google"

import "@/styles/globals.css"
import { siteConfig } from "@/config/site"
import { absoluteUrl, cn } from "@/lib/utils"
import { Analytics } from "@/components/analytics"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { Toaster } from "@/components/ui/toaster"
import { CourierProvider } from "@trycourier/react-provider";
import { Toast } from "@trycourier/react-toast";
import { useState, useEffect } from 'react';


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {

  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    async function fetchUserId() {
      const response = await fetch('/api/users/getCurrentUser',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            },  
            });
      const data = await response.json();
      setUserId(data.id);
    }

    fetchUserId();
  }, [])

  const CLIENT_KEY = process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY;
  const USER_ID = userId;

  console.log(userId)

  return (
    <html
      lang="en"
      className={cn(
        "bg-white font-sans text-slate-900 antialiased",
        fontSans.variable
      )}
    >
      <head />
      <body className="min-h-screen">
          <div>
            <CourierProvider clientKey={CLIENT_KEY} userId={USER_ID}>
                {children}
                <Toast />
            </CourierProvider>
            <Analytics />
            <Toaster />
            <TailwindIndicator />
          </div>
      </body>
    </html>
  )
}
