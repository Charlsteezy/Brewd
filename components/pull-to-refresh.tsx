"use client"

import * as React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useRouter } from "next/navigation";
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItemBrowser } from "@/components/post-item-browser"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react";
import { toast } from "@/hooks/use-toast"


interface ComponentProps {
  children: any,
  user: any,
  posts: any,
}

export default function PullToRefreshComponent({ children, user, posts }: ComponentProps) {

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

async function getAllPosts(){
  const res = await fetch("/api/getposts?5", {
    method: "GET",
    cache: "no-store",
  })

  if(!res.ok) {
    return toast({
      title: "Something went wrong.",
      description: "Couldn't refresh feed, try again later.",
      variant: "destructive",
    })
  }

  const posts = await res.json()

  console.log(posts)
  setPostsWithUser(posts)
}

const [postsWithUser, setPostsWithUser] = useState(posts)
const [loading, setLoading] = useState(false)

  return (
               <PullToRefresh onRefresh={() => getAllPosts()} pullDownThreshold={100} maxPullDownDistance={100} className="flex flex-col items-center justify-center">
                  <div>
                      {postsWithUser?.length ? (
                        <div>
                          {postsWithUser.map((post) => (
                            <PostItemBrowser key={post.id} post={post} user={user}  />
                          ))}
                        </div>
                      ) : (
                        <EmptyPlaceholder>
                          <EmptyPlaceholder.Icon name="post" />
                          <EmptyPlaceholder.Title>No results for your search.</EmptyPlaceholder.Title>
                          <EmptyPlaceholder.Description>
                            Try searching something else, or create a post.
                          </EmptyPlaceholder.Description>
                          <PostCreateButton
                            className={cn(
                              buttonVariants({ variant: "outline" }),
                              "text-slate-900"
                            )}
                          />
                        </EmptyPlaceholder>
                      )}
                    </div>
              </PullToRefresh>
  )
}
