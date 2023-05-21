import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"

import { withMethods } from "@/lib/api-middlewares/with-methods"
import { authOptions } from "@/lib/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(403).end()
  }

  const { user } = session

  if (req.method === "GET") {
      const userId = {id: user.id}

      return res.json(userId)
  }
}

export default withMethods(["GET", "POST"], handler)
