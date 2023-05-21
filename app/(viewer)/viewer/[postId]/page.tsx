import { notFound, redirect } from "next/navigation"
import { Post, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Viewer } from "@/components/viewer"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { CommentItem } from "@/components/post-comment-item"

import Image from "next/image"
import noCommentsImage from "/public/images/comments/communication.svg"

interface EditorPageProps {
  params: { postId: string }
}

export const revalidate = 10

async function getCurrentUsername(currentUserId: User["id"]) {
  return await db.user.findFirst({
      select: {
        name: true,
        image: true,
      },
      where: {
        id: currentUserId,
      },
    })
}

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

async function getUserForComment(userId: User["id"]) {
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

const getCommentsForPostWithCommenterInfo = async (postId: Post["id"]) => {
 
    const comments = await db.comments.findMany({
      where: {
        postId: postId,
      },
      select: {
        id: true,
        createdAt: true,
        commenterId: true,
        content: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

      const commentsWithCommenterInfo = await Promise.all(comments.map(async (comments) => {
      const commenter = await getUserForComment(comments.commenterId)
      const isASuperStar = await getUserSubscriptionPlan(comments.commenterId)
      return {
        ...comments,
        commenter,
        isASuperStar,
      }
    }))

    return commentsWithCommenterInfo
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  const commentsWithCommenter = await getCommentsForPostWithCommenterInfo(params.postId)


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

  const username = await getCurrentUsername(user.id)

  if(!username) {
    notFound()
  }

  const liked = await checkIfPostLiked(post.id, user.id)

  const likeCount = await getLikeCount(post.id)

  const commentCount = await getCommentCount(post.id)

  return (
    <div>
        <Viewer
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          published: post.published,
          category: post.category,
          authorName: author.name,
          authorImage: author.image,
          authorId: post.authorId,
          createdAt: post.createdAt,
          isPro: subscriptionPlan.isPro,
          currentUser: currentUserPro.isPro,
        }}

        currentUser={user.id}

        currentUsername={username.name}

        liked={liked}

        likeCount={likeCount}

        commentCount={commentCount}
      />
      <div className="prose prose-stone mx-auto">

        {commentsWithCommenter?.length ? (
          <div>
            {commentsWithCommenter.map((comment) => (
              <CommentItem key={comment.id} commentInfo={comment} />
            ))}
          </div>
        ) : (
        <div className="flex flex-col items-center justify-center">
          <Image src={noCommentsImage} width={175} alt="Hero image" priority />
          <h4>No one&apos;s replied to this post yet</h4> <h5>Be the first and get the conversation rolling</h5>
        </div>
        )}
      </div>
    </div>
  )
}
