// @ts-nocheck

"use client"

import { CourierProvider } from "@trycourier/react-provider";
import { Toast } from "@trycourier/react-toast";
import * as React from "react";
import { useEffect, useState } from "react";


interface ProvidersProps {
  children: React.ReactNode,
}

const CLIENT_KEY = process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY;

async function fetchUserId() {
  const response = await fetch('/api/users/getCurrentUser',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        },  
        });
  const data = await response.json();

  console.log(data.id);
  return data.id;
}

export default function Providers({ children }: ProvidersProps) {

  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const userId = fetchUserId();
    setUserId(userId);
  }
  , []);

  return (
              <CourierProvider clientKey={CLIENT_KEY} userId={userId}>
                  {children}
                  <Toast />
              </CourierProvider>
  )
}
