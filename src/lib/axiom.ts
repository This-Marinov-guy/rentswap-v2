import { Axiom } from '@axiomhq/js';
import { Logger, AxiomJSTransport, ConsoleTransport } from '@axiomhq/logging';
import {
  buildLogEntry,
  LOG_TYPES,
  LOG_LEVELS,
  AXIOM_DATASETS,
  AXIOM_SOURCE,
  type AxiomDataset,
  type AxiomLogEntry,
} from '@/models/Axiom';

let axiomClient: Axiom | null = null;
let logger: Logger | null = null;

type AxiomEnvironment = {
  AXIOM_PLATFORM_DATASET?: string;
  AXIOM_INTEGRATIONS_DATASET?: string;
};

export function rentswapAxiomDataset(
  dataset: AxiomDataset,
  environment: AxiomEnvironment = {
    AXIOM_PLATFORM_DATASET: process.env.AXIOM_PLATFORM_DATASET,
    AXIOM_INTEGRATIONS_DATASET: process.env.AXIOM_INTEGRATIONS_DATASET,
  },
): string {
  return dataset === AXIOM_DATASETS.INTEGRATIONS
    ? environment.AXIOM_INTEGRATIONS_DATASET || AXIOM_DATASETS.INTEGRATIONS
    : environment.AXIOM_PLATFORM_DATASET || AXIOM_DATASETS.PLATFORM;
}

function isAxiomEnabled(): boolean {
  const value = process.env.AXIOM_LOGGING_ENABLED?.trim().toLowerCase();
  return value !== '0' && value !== 'false' && value !== 'off';
}

export function getAxiomClient(): Axiom | null {
  if (axiomClient) {
    return axiomClient;
  }

  const token = process.env.AXIOM_TOKEN;
  const orgId = process.env.AXIOM_ORG_ID;

  if (!isAxiomEnabled() || !token) {
    console.warn('[Axiom] Logging is disabled or AXIOM_TOKEN is missing.');
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
          dataset: rentswapAxiomDataset(AXIOM_DATASETS.PLATFORM),
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
export async function logToAxiom(
  data: Record<string, unknown>,
  dataset: AxiomDataset = AXIOM_DATASETS.PLATFORM,
): Promise<void> {
  const client = getAxiomClient();

  if (!client) {
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
      dataset,
    });

    await client.ingest(rentswapAxiomDataset(dataset), [entry]);
  } catch (error) {
    console.error('[Axiom] Failed to log data:', error);
  }
}

export interface IntegrationLogData {
  duration?: number;
  statusCode?: number;
  success?: boolean;
  message?: string;
  analytics?: Record<string, unknown>;
}

/** Logs one sanitized summary for a call from RentSwap to an external service. */
export async function logIntegration(
  service: string,
  operation: string,
  data: IntegrationLogData = {},
): Promise<void> {
  const success = data.success ?? true;
  const entry: AxiomLogEntry = buildLogEntry(LOG_TYPES.HTTP, AXIOM_SOURCE, {
    request: { service, operation },
    response: {
      success,
      ...(data.statusCode !== undefined ? { statusCode: data.statusCode } : {}),
      ...(data.duration !== undefined ? { duration: data.duration } : {}),
    },
    analytics: data.analytics ?? null,
    message: data.message?.substring(0, 500) ?? null,
    level: success ? LOG_LEVELS.INFO : LOG_LEVELS.ERROR,
    dataset: AXIOM_DATASETS.INTEGRATIONS,
  });

  const client = getAxiomClient();
  if (!client) return;

  try {
    await client.ingest(rentswapAxiomDataset(AXIOM_DATASETS.INTEGRATIONS), [entry]);
  } catch (error) {
    console.error('[Axiom] Failed to log integration:', error);
  }
}
