"use client"

import * as React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useRouter } from "next/navigation";

export const revalidate = 0;


interface ComponentProps {
  children: any,
  user: any,
}

export default function PullToRefreshComponent({ children, user }: ComponentProps) {

const router = useRouter()

  return (
               <PullToRefresh onRefresh={async () => router.refresh()}>
                  {children}
              </PullToRefresh>
  )
}
