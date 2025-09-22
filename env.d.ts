/// <reference types="vite/client" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type {
  Cart,
  CustomerAccount,
  HydrogenCart,
  HydrogenSessionData,
  Storefront,
} from '@shopify/hydrogen';
import type {AppSession} from '~/lib/session';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: 'production' | 'development'}};

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    SESSION_SECRET: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PRIVATE_STOREFRONT_API_TOKEN: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_ID?: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID?: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_URL?: string;
    PUBLIC_CHECKOUT_DOMAIN?: string;
  }

  /**
   * The load context used in the app.
   */
  interface AppLoadContext {
    waitUntil: ExecutionContext['waitUntil'];
    session: AppSession;
    storefront: Storefront;
    customerAccount?: CustomerAccount;
    cart: HydrogenCart;
    env: Env;
  }
}

// Needed to make this file a module.
export {};