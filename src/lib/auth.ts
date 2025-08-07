import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"
import { headers } from "next/headers"
import { Resend } from "resend"
import { EmailTemplate } from "@daveyplate/better-auth-ui/server"
import React from "react"
import { db } from "@/database/db"
import * as schema from "@/database/schema"
import { type Plan, plans } from "@/lib/payments/plans"
import { site } from "@/config/site"

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
  typescript: true
})

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  trustedOrigins: ["http://scubi.local:3000"],
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
      disableIpTracking: false
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    disableCSRFCheck: false,
    crossSubDomainCookies: {
      enabled: true,
      additionalCookies: ["custom_cookie"],
      domain:
        process.env.NODE_ENV === "development"
          ? ".scubi.local"
          : ".yourdomain.com"
    },
    cookies: {
      session_token: {
        name: "scubi_session_token",
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production"
        }
      }
    },
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    },
    cookiePrefix: "myapp"
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema
  }),
  wqfcqr: true,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const name = user.name || user.email.split("@")[0]

      await resend.emails.send({
        from: site.mailFrom,
        to: user.email,
        subject: "Reset your password",
        react: EmailTemplate({
          heading: "Reset your password",
          content: React.createElement(
            React.Fragment,
            null,
            React.createElement("p", null, `Hi ${name},`),
            React.createElement(
              "p",
              null,
              "Someone requested a password reset for your account. If this was you, ",
              "click the button below to reset your password."
            ),
            React.createElement(
              "p",
              null,
              "If you didn't request this, you can safely ignore this email."
            )
          ),
          action: "Reset Password",
          url,
          siteName: site.name,
          baseUrl: site.url,
          imageUrl: `${site.url}/logo.png` // svg are not supported by resend
        })
      })
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }
  },
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: plans,
        getCheckoutSessionParams: async ({ user, plan }) => {
          const checkoutSession: {
            params: {
              subscription_data?: {
                trial_period_days: number
              }
            }
          } = {
            params: {}
          }

          if (user.trialAllowed) {
            checkoutSession.params.subscription_data = {
              trial_period_days: (plan as Plan).trialDays
            }
          }

          return checkoutSession
        },
        onSubscriptionComplete: async ({ event }) => {
          const eventDataObject = event.data.object as Stripe.Checkout.Session
          const userId = eventDataObject.metadata?.userId
        }
      }
    })
  ]
})

export async function getActiveSubscription() {
  const nextHeaders = await headers()
  const subscriptions = await auth.api.listActiveSubscriptions({
    headers: nextHeaders
  })
  return subscriptions.find((s) => s.status === "active")
}
