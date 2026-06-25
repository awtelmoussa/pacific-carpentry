import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except static assets and api routes
  matcher: ['/', '/(en|ar)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
