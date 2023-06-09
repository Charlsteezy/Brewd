import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { withMethods } from "@/lib/api-middlewares/with-methods"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const CommentSchema = z.object({
  commenterId: z.string().optional(),
  postId: z.string(),
  content: z.string().optional(),
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(403).end()
  }

  const { user } = session

  if (req.method === "GET") {
    try {
      const posts = await db.comments.findMany({
        select: {
          id: true,
          createdAt: true,
        },
        where: {
          commenterId: user.id,
        },
      })

      return res.json(posts)
    } catch (error) {
      return res.status(500).end()
    }
  }

  if (req.method === "POST") {
    try {

      const body = CommentSchema.parse(req.body)

      const post = await db.comments.create({
        data: {
          commenterId: session.user.id,
          postId: body.postId,
          content: body.content,
        },
      })

      return res.json(post)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      if (error instanceof RequiresProPlanError) {
        return res.status(402).end()
      }

      return res.status(500).end()
    }
  }
}

export default withMethods(["GET", "POST"], handler)
