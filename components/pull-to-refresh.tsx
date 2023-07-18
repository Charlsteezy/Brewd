"use client"

import * as React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface ComponentProps {
  children: any,
  user: any,
}

async function revalidate() { 
  const response = await fetch("http://localhost:3000/api/revalidatePath", {
    method: "GET",
  })

  console.log(response.json())
}

export default function PullToRefreshComponent({ children, user }: ComponentProps) {

const router = useRouter()

const getNewData = (): Promise<void> => {
  return new Promise(res => {
    setTimeout(() => {
      res(router.refresh());
    }, 1500);
  });
};

  return (
               <PullToRefresh onRefresh={() => getNewData()} pullDownThreshold={100} maxPullDownDistance={100} className="flex flex-col items-center justify-center">
                  {children}
              </PullToRefresh>
  )
}
