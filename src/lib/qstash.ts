import { Client } from "@upstash/qstash";

let qstashClient: Client | null = null;

export function getQStashClient(): Client | null {
  // Check if we're in production - support multiple environment variable patterns
  const isProduction = 
    process.env.APP_ENV === 'prod' ||
    process.env.APP_ENV === 'production' ||
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production';
  
  // Disable QStash in development
  if (!isProduction) {
    return null;
  }

  if (qstashClient) {
    return qstashClient;
  }

  const token = process.env.QSTASH_TOKEN;

  if (!token) {
    return null;
  }

  try {
    qstashClient = new Client({
      token,
    });
    return qstashClient;
  } catch {
    return null;
  }
}

export async function publishQStashJob(
  url: string, 
  body: Record<string, unknown>
): Promise<{ queued: boolean; messageId?: string; executedSynchronously?: boolean }> {
  const qstash = getQStashClient();

  if (!qstash) {
    return { queued: false, executedSynchronously: true };
  }

  try {
    const result = await qstash.publishJSON({
      url,
      body,
    });
    
    return { queued: true, messageId: result.messageId };
  } catch {
    throw new Error('Failed to publish QStash job');
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
