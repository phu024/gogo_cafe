import { NextResponse } from 'next/server';

// Middleware disabled per user request — no-op implementation to avoid affecting routes
export function middleware() {
  return NextResponse.next();
}

export const config = {
  // matcher set to a non-matching path so middleware does not run
  matcher: ['/__middleware_disabled__'],
};
