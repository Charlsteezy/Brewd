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

const courier = CourierClient({ authorizationToken: "pk_prod_HHV4AD5QDT4AC4MWRCHDYGKF0RR0"});

const { requestId } = await courier.send({
  message: {
    to: {
      user_id: req.body.authorId,
      courier: {
        channel: req.body.authorId,
      },
    },
    template: "G4T4KFS7RWMYEPJ1KZHWH9FD1BWY",
    data: {
        title: req.body.title,
        message: req.body.message,
        url: req.body.url,
    },
  },
});
  }
}

export default withMethods(["GET", "POST"], handler)
