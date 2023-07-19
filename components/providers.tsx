// @ts-nocheck

"use client"

import { CourierProvider } from "@trycourier/react-provider";
import { Toast } from "@trycourier/react-toast";
import * as React from "react";


interface ProvidersProps {
  children: React.ReactNode,
}

const CLIENT_KEY = process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY;

async function fetchUserId() {
  const response = await fetch('http://localhost:3000/api/users/getCurrentUser',
    {
      method: 'GET'  
        });
  const data = await response.json();

  console.log(data.id);
  return data.id;
}

const userId = fetchUserId();

export default function Providers({ children}: ProvidersProps) {

  return (
              <CourierProvider clientKey={CLIENT_KEY} userId={userId}>
                  {children}
                  <Toast />
              </CourierProvider>
  )
}
