export async function register() {
  // Initialize Axiom client on server startup
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getAxiomClient } = await import('@/lib/axiom');
    getAxiomClient();
    console.log('[Instrumentation] Axiom client initialized');
  }
}
