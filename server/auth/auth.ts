import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db';
import { admin } from 'better-auth/plugins';
import { sendEmail } from '@/lib/email';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET as string,
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verifikasi Email Anda',
        html: `<p>Silakan verifikasi email Anda dengan mengklik tautan berikut:</p>
               <a href="${url}">Verifikasi Email</a>
               <p>Jika Anda tidak membuat permintaan ini, abaikan email ini.</p>`,
      });
    },
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [admin()],
});

export type Session = typeof auth.$Infer.Session;
