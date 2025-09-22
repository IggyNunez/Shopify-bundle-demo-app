import {Await, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartMain} from '~/components/Cart';
import {useRootLoaderData} from '~/root';

export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
};

export default function Cart() {
  const rootData = useRootLoaderData();
  const cartPromise = rootData?.cart;

  return (
    <div className="cart" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Cart</h1>
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await
          resolve={cartPromise}
          errorElement={<div>An error occurred</div>}
        >
          {(cart) => {
            return <CartMain layout="page" cart={cart as CartApiQueryFragment} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export function useRootLoaderData() {
  // This is a placeholder - in a real app, you'd get this from the root loader
  return {
    cart: Promise.resolve(null),
  };
}