"use client"

import { CourierProvider } from "@trycourier/react-provider";
import { Toast } from "@trycourier/react-toast";
import { userData } from "@/components/user-data";


interface ProvidersProps {
  children: React.ReactNode,
  userId: any,
}

const CLIENT_KEY = process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY;

export default function Providers({ children, userId }: ProvidersProps) {

  return (
              <CourierProvider clientKey={CLIENT_KEY} userId={userId}>
                  {children}
                  <Toast />
              </CourierProvider>
  )
}
