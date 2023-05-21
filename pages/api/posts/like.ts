import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { withMethods } from "@/lib/api-middlewares/with-methods"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const likeCreateSchema = z.object({
  postId: z.string(),
  authorId: z.string(),
  likedBy: z.string(),
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(403).end()
  }

  const { user } = session

  if (req.method === "POST") {
    try {

      const body = likeCreateSchema.parse(req.body)

      const like = await db.likes.create({
        data: {
          postId: body.postId,
          authorId: body.authorId,
          likedBy: body.likedBy,
        },
      })

      return res.json(like)

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues)
      }

      return res.status(500).end()
    }
  }
}

export default withMethods(["GET", "POST"], handler)
