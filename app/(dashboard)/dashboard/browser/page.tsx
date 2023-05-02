import { cache } from "react"
import { redirect } from "next/navigation"
import { Post, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { cn } from "@/lib/utils"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItemBrowser } from "@/components/post-item-browser"
import { DashboardShell } from "@/components/shell"
import { buttonVariants } from "@/components/ui/button"

export const metadata = {
  title: "Dashboard",
}

async function getUserForPost(userId: User["id"]) {
  return await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      name: true,
      image: true,
    },
  })
}


const getPostsForUser = cache(async () => {
  return await db.post.findFirst({
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
})

const getPostsForUserWithAuthorInfo = async () => {
 
    const posts = await db.post.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
        category: true,
        authorId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const postsWithAuthorInfo = await Promise.all(posts.map(async (post) => {
      const author = await getUserForPost(post.authorId)
      const isASuperStar = await getUserSubscriptionPlan(post.authorId)
      return {
        ...post,
        author,
        isASuperStar,
      }
    }))

    return postsWithAuthorInfo
}



export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

    const postsWithUser = await getPostsForUserWithAuthorInfo()

    console.log(postsWithUser)

  return (
    <DashboardShell>
      <DashboardHeader heading="Browse posts" text="Explore the community">
        <PostCreateButton />
      </DashboardHeader>
      <div>
        {postsWithUser?.length ? (
          <div className="divide-y divide-neutral-200 rounded-md border border-slate-200">
            {postsWithUser.map((post) => (
              <PostItemBrowser key={post.id} post={post} />
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
    </DashboardShell>
  )
}
