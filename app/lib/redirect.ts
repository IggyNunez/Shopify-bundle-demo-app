import {redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

/**
 * Check if the request URL pathname has been localized and redirect if needed
 */
export async function redirectIfHandleIsLocalized({
  request,
  context,
  pathname,
}: {
  request: Request;
  context: LoaderFunctionArgs['context'];
  pathname: string;
}) {
  const url = new URL(request.url);
  const currentPath = url.pathname;
  
  // Check if the current path matches the expected pathname
  if (currentPath !== pathname) {
    // Preserve search params when redirecting
    const searchParams = url.search;
    return redirect(pathname + searchParams, 301);
  }
  
  return null;
}