import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { CourierClient } from "@trycourier/courier";
import { withMethods } from "@/lib/api-middlewares/with-methods"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(403).end()
  }

  const { user } = session

  if (req.method === "POST") {

const courier = CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

const { requestId } = await courier.send({
  message: {
    to: {
      user_id: "charlsteezy12",
      courier: {
        channel: "charlsteezy12",
      },
    },
    template: "G4T4KFS7RWMYEPJ1KZHWH9FD1BWY",
    data: {
        Username: session.user.name,
        PostName: req.body.postname,
        url: req.body.url,
    },
  },
});
  }
}

export default withMethods(["GET", "POST"], handler)
