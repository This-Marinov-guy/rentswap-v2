import { NextRequest, NextResponse } from 'next/server';
import { getAxiomLogger, logToAxiom } from '@/lib/axiom';

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const logger = getAxiomLogger();
  const requestId = crypto.randomUUID();

  // Extract request information
  const requestInfo = {
    requestId,
    method: request.method,
    url: request.url,
    pathname: request.nextUrl.pathname,
    searchParams: Object.fromEntries(request.nextUrl.searchParams),
    headers: Object.fromEntries(request.headers.entries()),
    ip: request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    timestamp: new Date().toISOString(),
    type: 'http_request',
  };

  // Log request
  if (logger) {
    logger.info('Incoming request', requestInfo);
  }

  // Also log to Axiom directly for better tracking
  await logToAxiom(requestInfo);

  // Continue with the request
  const response = NextResponse.next();

  // Add request ID to response headers for tracing
  response.headers.set('X-Request-ID', requestId);

  // Calculate duration after response
  const duration = Date.now() - startTime;

  // Log response (this will be logged after the response is sent)
  const responseInfo = {
    requestId,
    method: request.method,
    url: request.url,
    pathname: request.nextUrl.pathname,
    statusCode: response.status,
    duration,
    timestamp: new Date().toISOString(),
    type: 'http_response',
  };

  if (logger) {
    // Use setTimeout to log after response is sent
    setTimeout(() => {
      logger?.info('Outgoing response', responseInfo);
      logToAxiom(responseInfo).catch(err => {
        console.error('[Middleware] Failed to log response to Axiom:', err);
      });
    }, 0);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * Note: API routes are included for logging
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

