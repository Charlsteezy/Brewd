import { redirect } from "next/navigation"
import { Post, User } from "@prisma/client"
import { toast } from "@/hooks/use-toast"

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
import PullToRefreshComponent from "@/components/pull-to-refresh"

export const metadata = {
  title: "Browser",
}

export const revalidate = 84600;

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


const getPostsForUser = async () => {
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
}

async function checkIfPostLiked(postId: Post["id"], userId: User["id"]) {
  const checkLiked =  await db.likes.findFirst({
    where: {
      postId: postId,
      likedBy: userId,
    },
  })

  if(checkLiked) {
    return true
  }else {
    return false
  }
}

async function getLikeCount(postId: Post["id"]) {
  const likeCount =  await db.likes.count({
    where: {
      postId: postId
    },
  })

  if(!likeCount) {
    return 0
  }else {
    return likeCount
  }
}

async function getCommentCount(postId: Post["id"]) {
  const commentCount =  await db.comments.count({
    where: {
      postId: postId
    },
  })

  if(!commentCount) {
    return 0
  }else {
    return commentCount
  }
}

const getPostsForUserWithAuthorInfo = async (user) => {
 
    const posts = await db.post.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
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
      
      const liked = await checkIfPostLiked(post.id, user.id)

      const likeCount = await getLikeCount(post.id)

    const commentCount = await getCommentCount(post.id)
      return {
        ...post,
        author,
        isASuperStar,
        liked,
        likeCount,
        commentCount,
      }
    }))

    return postsWithAuthorInfo
}

async function getAllPosts(){
  const res = await fetch("/api/getposts", {
    method: "GET",
  })

  const posts = await res.json()

  console.log(posts)
}



export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

    const postsWithUser = await getPostsForUserWithAuthorInfo(user)

  return (
    <DashboardShell>
      <DashboardHeader heading="Browse posts" text="Explore the community">
        <PostCreateButton />
      </DashboardHeader>

      <PullToRefreshComponent user={user} posts={postsWithUser}>
      </PullToRefreshComponent>
    </DashboardShell>
  )
}
