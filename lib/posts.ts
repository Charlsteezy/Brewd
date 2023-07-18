import { Post, User } from "@prisma/client"
import { db } from "@/lib/db"

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