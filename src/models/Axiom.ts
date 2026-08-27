/**
 * Shared Axiom log entry structure for use across APIs.
 * Import this in other services to keep the same request/response/analytics shape.
 */

/** Log entry types */
export const LOG_TYPES = {
  HTTP: "http",
  SCHEDULER: "scheduler",
  PROCESS: "process",
} as const;

/** Log levels */
export const LOG_LEVELS = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;

/** Logical Axiom destinations used across the Domakin ecosystem. */
export const AXIOM_DATASETS = {
  PLATFORM: "platform",
  INTEGRATIONS: "integrations",
} as const;

export type LogType = (typeof LOG_TYPES)[keyof typeof LOG_TYPES];
export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];
export type AxiomDataset = (typeof AXIOM_DATASETS)[keyof typeof AXIOM_DATASETS];

/**
 * Standard Axiom log entry shape.
 * Every entry has: _time, type, source, request, response, analytics.
 */
export interface AxiomLogEntry {
  _time: string;
  type: LogType;
  source: string;
  request: Record<string, unknown> | null;
  response: Record<string, unknown> | null;
  analytics: Record<string, unknown> | null;
  message?: string | null;
  level?: LogLevel;
  axiom_dataset: AxiomDataset;
  [key: string]: unknown;
}

export interface BuildLogEntryPayload {
  request?: Record<string, unknown> | null;
  response?: Record<string, unknown> | null;
  analytics?: Record<string, unknown> | null;
  message?: string | null;
  level?: LogLevel;
  dataset?: AxiomDataset;
  extra?: Record<string, unknown>;
}

/**
 * Builds a base log entry with the standard structure.
 * Use in any API: pass type, source, and request/response/analytics.
 */
export function buildLogEntry(
  type: LogType,
  source: string,
  payload: BuildLogEntryPayload = {}
): AxiomLogEntry {
  const entry: AxiomLogEntry = {
    _time: new Date().toISOString(),
    type,
    source,
    request: payload.request ?? null,
    response: payload.response ?? null,
    analytics: payload.analytics ?? null,
    message: payload.message ?? null,
    level: payload.level ?? LOG_LEVELS.INFO,
    axiom_dataset: payload.dataset ?? AXIOM_DATASETS.PLATFORM,
  };
  if (payload.extra && typeof payload.extra === "object") {
    Object.assign(entry, payload.extra);
  }
  return entry;
}

/** Source identifier for this service */
export const AXIOM_SOURCE = "rentswap";
