import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
  isRouteErrorResponse,
} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Analytics, getShopAnalytics} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {AsideProvider} from '~/components/Aside';
import appStyles from '~/styles/app.css?url';

export const links = () => {
  return [
    {rel: 'stylesheet', href: appStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const layout = await context.storefront.query(LAYOUT_QUERY);
  const analytics = getShopAnalytics({
    storefront: context.storefront,
    publicStorefrontId: context.env.PUBLIC_STOREFRONT_ID,
  });

  return defer({
    shop: layout.shop,
    analytics,
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AsideProvider>
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <Layout>
              <Outlet />
            </Layout>
          </Analytics.Provider>
        </AsideProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <header style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <a href="/" style={{
          textDecoration: 'none',
          color: 'inherit',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}>
          Bundle Store
        </a>
        <nav style={{display: 'flex', gap: '2rem'}}>
          <a href="/collections/all" style={{textDecoration: 'none', color: 'inherit'}}>
            Shop
          </a>
          <a href="/cart" style={{textDecoration: 'none', color: 'inherit'}}>
            Cart
          </a>
        </nav>
      </header>
      
      <main style={{minHeight: 'calc(100vh - 200px)'}}>
        {children}
      </main>
      
      <footer style={{
        padding: '2rem',
        borderTop: '1px solid #e5e5e5',
        textAlign: 'center',
        color: '#666',
      }}>
        <p>&copy; 2025 Bundle Store. Powered by Shopify Hydrogen</p>
      </footer>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useMatches()[0]?.data;
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            minHeight: '50vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>
              {errorStatus}
            </h1>
            <h2 style={{fontSize: '1.5rem', marginBottom: '2rem', color: '#666'}}>
              {errorStatus === 404 ? 'Page not found' : 'Something went wrong'}
            </h2>
            {errorMessage && (
              <p style={{marginBottom: '2rem', color: '#999'}}>
                {errorMessage}
              </p>
            )}
            <a 
              href="/"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#000',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
              }}
            >
              Go to Homepage
            </a>
          </div>
        </Layout>
        <Scripts />
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      name
      description
      id
      primaryDomain {
        url
      }
      brand {
        logo {
          image {
            url
          }
        }
      }
    }
  }
`;