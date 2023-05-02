import { notFound, redirect } from "next/navigation"
import { Post, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Viewer } from "@/components/viewer"
import { getUserSubscriptionPlan } from "@/lib/subscription"

async function getUserForPost(userId: User["id"]) {
  return await db.user.findFirst({
      select: {
        name: true,
        image: true,
      },
      where: {
        id: userId,
      },
    })
}

async function getPostForUser(postId: Post["id"]) {
  return await db.post.findFirst({
    where: {
      id: postId,
    },
  })
}

interface EditorPageProps {
  params: { postId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const post = await getPostForUser(params.postId)

  if (!post) {
    notFound()
  }

  const author = await getUserForPost(post.authorId)

  if (!author) {
    notFound()
  }

  const subscriptionPlan = await getUserSubscriptionPlan(post.authorId)

  if(!subscriptionPlan) {
    notFound()
  }

  const currentUserPro = await getUserSubscriptionPlan(user.id)

  if(!currentUserPro) {
    notFound()
  }

  return (
    <Viewer
      post={{
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
        category: post.category,
        authorName: author.name,
        authorImage: author.image,
        createdAt: post.createdAt,
        isPro: subscriptionPlan.isPro,
        currentUser: currentUserPro.isPro,
      }}
    />
  )
}
