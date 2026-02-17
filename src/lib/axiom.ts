import { Axiom } from '@axiomhq/js';
import { Logger, AxiomJSTransport, ConsoleTransport } from '@axiomhq/logging';
import {
  buildLogEntry,
  LOG_TYPES,
  LOG_LEVELS,
  AXIOM_SOURCE,
  type AxiomLogEntry,
} from '@/models/Axiom';

let axiomClient: Axiom | null = null;
let logger: Logger | null = null;

export function getAxiomClient(): Axiom | null {
  if (axiomClient) {
    return axiomClient;
  }

  const token = process.env.AXIOM_TOKEN;
  const dataset = process.env.AXIOM_DATASET;
  const orgId = process.env.AXIOM_ORG_ID;

  if (!token || !dataset) {
    console.warn('[Axiom] Missing AXIOM_TOKEN or AXIOM_DATASET. Axiom logging disabled.');
    return null;
  }

  try {
    axiomClient = new Axiom({
      token,
      orgId,
    });

    logger = new Logger({
      transports: [
        new AxiomJSTransport({
          axiom: axiomClient,
          dataset,
        }),
        ...(process.env.NODE_ENV === 'development' ? [new ConsoleTransport({ prettyPrint: true })] : []),
      ],
    });

    return axiomClient;
  } catch (error) {
    console.error('[Axiom] Failed to initialize Axiom client:', error);
    return null;
  }
}

export function getAxiomLogger(): Logger | null {
  if (logger) {
    return logger;
  }

  getAxiomClient();
  return logger;
}

/** Keys that belong in the request context */
const REQUEST_KEYS = new Set([
  'requestId', 'method', 'endpoint', 'pathname', 'url', 'ip', 'userAgent', 'timestamp', 'searchParams',
]);

/** Keys that belong in the response context */
const RESPONSE_KEYS = new Set([
  'statusCode', 'status', 'success', 'duration', 'totalDuration', 'error', 'errorType', 'timestamp',
]);

/** Keys that belong in analytics (everything else we care about) */
const ANALYTICS_KEYS = new Set([
  'type', 'propertyId', 'city', 'imageCount', 'errorFields', 'errorCount', 'jobId',
]);

function pick<T extends Record<string, unknown>>(obj: T, keys: Set<string>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in obj && obj[key] !== undefined) {
      const v = obj[key];
      if (key === 'error' && typeof v === 'string') {
        out[key] = v.substring(0, 500);
      } else {
        out[key] = v;
      }
    }
  }
  return out;
}

/**
 * Logs to Axiom using the standard structure: type, source, request, response, analytics.
 * All requests use source = "rentswap" and type = "http" (for API/middleware logs).
 * Pass a flat payload; it will be mapped into request/response/analytics.
 */
export async function logToAxiom(data: Record<string, unknown>): Promise<void> {
  const client = getAxiomClient();
  const dataset = process.env.AXIOM_DATASET;

  if (!client || !dataset) {
    return;
  }

  try {
    const request = pick(data, REQUEST_KEYS);
    const response = pick(data, RESPONSE_KEYS);
    const analytics = pick(data, ANALYTICS_KEYS);

    const level =
      data.success === false
        ? (data.statusCode && Number(data.statusCode) >= 500 ? LOG_LEVELS.ERROR : LOG_LEVELS.WARN)
        : LOG_LEVELS.INFO;

    const entry: AxiomLogEntry = buildLogEntry(LOG_TYPES.HTTP, AXIOM_SOURCE, {
      request: Object.keys(request).length ? request : null,
      response: Object.keys(response).length ? response : null,
      analytics: Object.keys(analytics).length ? analytics : null,
      message: (data.message as string) ?? null,
      level,
    });

    await client.ingest(dataset, [entry]);
  } catch (error) {
    console.error('[Axiom] Failed to log data:', error);
  }
}
