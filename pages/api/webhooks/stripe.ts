import { NextApiRequest, NextApiResponse } from "next"
import rawBody from "raw-body"
import Stripe from "stripe"
import { sendNotification } from "@/lib/sendNotification"

import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export const config = {
  api: {
    // Turn off the body parser so we can access raw body for verification.
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = await rawBody(req)
  const signature = req.headers["stripe-signature"] as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`)
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    await db.user.update({
      where: {
        id: session?.metadata?.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })

    const notificationTitle = "You're a superstar!"

    const notificationMessage = "Thanks very much for becoming a superstar! It really helps out and will help grow the community"

    sendNotification("clgkrmcrg000079eggm4ihywc", notificationTitle, notificationMessage, "/dashboard/billing")
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Update the price id and set the new period end.
    await db.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })

    const notificationTitle = "You recieved 500 Superstar coins!"

    const notificationMessage = "Thanks for your continued support! Here's 500 Superstar coins to spread the love and make people feel special!"

    sendNotification("clgkrmcrg000079eggm4ihywc", notificationTitle, notificationMessage, "/dashboard/billing")
  }

  return res.json({})
}
