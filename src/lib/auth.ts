import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db, schema } from "@/lib/db";
import { env } from "@/lib/env";

const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

if (env.github.clientId && env.github.clientSecret) {
  socialProviders.github = {
    clientId: env.github.clientId,
    clientSecret: env.github.clientSecret,
  };
}

if (env.google.clientId && env.google.clientSecret) {
  socialProviders.google = {
    clientId: env.google.clientId,
    clientSecret: env.google.clientSecret,
  };
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders,
  user: {
    additionalFields: {
      username: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
