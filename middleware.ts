import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except static assets, api, and admin routes
  matcher: ['/', '/(en|ar)/:path*', '/((?!api|admin|_next|_vercel|.*\\..*).*)']
};
