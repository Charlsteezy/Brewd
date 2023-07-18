import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { Post, User } from "@prisma/client"
import * as z from "zod"

import { withMethods } from "@/lib/api-middlewares/with-methods"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { getCurrentUser } from "@/lib/session"

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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return new Response(null, { status: 401 })
  }

  if (req.method === "GET") {
    try {
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
              
              const liked = await checkIfPostLiked(post.id, session.user.id)
        
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
        
            return new Response(JSON.stringify(postsWithAuthorInfo), { status: 200 })
        
    } catch (error) {
      return new Response(error.message, { status: 500 })
    }
  }
}
