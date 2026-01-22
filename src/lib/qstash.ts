import { Client } from "@upstash/qstash";

let qstashClient: Client | null = null;

export function getQStashClient(): Client | null {
  // Disable QStash in development
  if (process.env.APP_ENV !== 'prod') {
    console.log('[QStash] Disabled - APP_ENV is not "prod"');
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
    console.log('[QStash] Client initialized successfully');
    return qstashClient;
  } catch (error) {
    console.error('[QStash] Failed to initialize QStash client:', error);
    return null;
  }
}

export async function publishQStashJob(url: string, body: Record<string, unknown>, jobType: string): Promise<void> {
  const qstash = getQStashClient();
  const jobId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  if (!qstash) {
    console.log(`[QStash] Skipping job ${jobType} - QStash disabled`);
    return;
  }

  try {
    console.log(`[QStash] Publishing job: ${jobType}`, {
      jobId,
      url,
      timestamp,
      bodyKeys: Object.keys(body),
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
  } catch (error) {
    console.error(`[QStash] Failed to queue job: ${jobType}`, {
      jobId,
      url,
      error: error instanceof Error ? error.message : String(error),
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
