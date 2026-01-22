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
    console.log('[QStash] Disabled - not in production', {
      APP_ENV: process.env.APP_ENV,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    });
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
    console.log('[QStash] Client initialized successfully', {
      APP_ENV: process.env.APP_ENV,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    });
    return qstashClient;
  } catch (error) {
    console.error('[QStash] Failed to initialize QStash client:', error);
    return null;
  }
}

export async function publishQStashJob(
  url: string, 
  body: Record<string, unknown>, 
  jobType: string
): Promise<{ queued: boolean; messageId?: string; executedSynchronously?: boolean }> {
  const qstash = getQStashClient();
  const jobId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  if (!qstash) {
    console.log(`[QStash] QStash disabled for ${jobType}, will execute synchronously`, {
      jobId,
      url,
      timestamp,
      APP_ENV: process.env.APP_ENV,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    });
    return { queued: false, executedSynchronously: true };
  }

  try {
    console.log(`[QStash] Publishing job: ${jobType}`, {
      jobId,
      url,
      timestamp,
      bodyKeys: Object.keys(body),
      baseUrl: getBaseUrl(),
    });

    const result = await qstash.publishJSON({
      url,
      body,
    });

    console.log(`[QStash] Job queued successfully: ${jobType}`, {
      jobId,
      messageId: result.messageId,
      url,
      timestamp,
    });
    
    return { queued: true, messageId: result.messageId };
  } catch (error) {
    console.error(`[QStash] Failed to queue job: ${jobType}`, {
      jobId,
      url,
      error: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      timestamp,
    });
    throw error;
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
