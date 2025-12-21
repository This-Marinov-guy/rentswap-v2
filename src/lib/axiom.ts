import { Axiom } from '@axiomhq/js';
import { Logger, AxiomJSTransport, ConsoleTransport } from '@axiomhq/logging';

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

  // Initialize client if not already done
  getAxiomClient();
  return logger;
}

export async function logToAxiom(data: Record<string, unknown>): Promise<void> {
  const client = getAxiomClient();
  const dataset = process.env.AXIOM_DATASET;

  if (!client || !dataset) {
    return;
  }

  try {
    await client.ingest(dataset, [data]);
  } catch (error) {
    console.error('[Axiom] Failed to log data:', error);
  }
}

