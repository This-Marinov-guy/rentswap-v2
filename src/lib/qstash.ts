import { Client } from "@upstash/qstash";

let qstashClient: Client | null = null;

export function getQStashClient(): Client | null {
  // Disable QStash in development
  if (process.env.APP_ENV !== 'prod') {
    return null;
  }

  if (qstashClient) {
    return qstashClient;
  }

  const token = process.env.QSTASH_TOKEN;

  if (!token) {
    console.warn('[QStash] Missing QSTASH_TOKEN. QStash background jobs disabled.');
    return null;
  }

  try {
    qstashClient = new Client({
      token,
    });
    return qstashClient;
  } catch (error) {
    console.error('[QStash] Failed to initialize QStash client:', error);
    return null;
  }
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback for local development
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000'
    : 'https://rentswap.nl';
}
