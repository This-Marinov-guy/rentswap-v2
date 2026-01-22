import { NextResponse } from "next/server";
import { getQStashClient, getBaseUrl } from "@/lib/qstash";

export async function GET() {
  const qstash = getQStashClient();
  const baseUrl = getBaseUrl();
  
  return NextResponse.json({
    qstashEnabled: !!qstash,
    hasQStashToken: !!process.env.QSTASH_TOKEN,
    baseUrl,
    environment: {
      APP_ENV: process.env.APP_ENV,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
    backgroundEndpoints: {
      sendNotification: `${baseUrl}/api/background/send-notification`,
      logToAxiom: `${baseUrl}/api/background/log-to-axiom`,
    },
  });
}
