"use client"

import * as React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface ComponentProps {
  children: any,
  user: any,
}

export default function PullToRefreshComponent({ children, user }: ComponentProps) {

  async function revalidate() { 

    const response = await fetch("https://brewd-d4a2.vercel.app/api/revalidatePath", {
      method: "GET",
    })
  
    console.log(response.json())
  }

const router = useRouter()

const getNewData = (): Promise<void> => {
  return new Promise(res => {
    setTimeout(() => {
      res(revalidate().then(() => router.refresh()));
    }, 4000);
  }).then(() => console.log("Refreshed!"))
  .catch(() => alert("Unable to refresh, try again later."));
};

  return (
               <PullToRefresh onRefresh={() => getNewData()} pullDownThreshold={100} maxPullDownDistance={100} className="flex flex-col items-center justify-center">
                  {children}
              </PullToRefresh>
  )
}
