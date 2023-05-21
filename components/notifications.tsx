"use client"

import { CourierProvider } from "@trycourier/react-provider";
import { Toast } from "@trycourier/react-toast";

const CLIENT_KEY = process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY;
const USER_ID = "Github_28081510";

export function Notifications() {

  return (
    <p>
        Hey, I&apos;m a notification!
        <CourierProvider clientKey={CLIENT_KEY} userId={USER_ID}>
            <Toast />
        </CourierProvider>
    </p>
  )
}