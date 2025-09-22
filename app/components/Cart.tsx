import {CartForm, Money} from '@shopify/hydrogen';
import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartLineItem} from './CartLineItem';
import {Aside} from './Aside';

export function Cart({
  layout,
  cart: originalCart,
}: {
  layout: 'page' | 'aside';
  cart?: CartApiQueryFragment | null;
}) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.edges?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-${layout}`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

export function CartMain({
  cart,
  layout,
}: {
  cart?: CartApiQueryFragment | null;
  layout: 'page' | 'aside';
}) {
  const linesCount = Boolean(cart?.lines?.edges?.length || 0);

  return (
    <div className="cart-main">
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

function CartDetails({
  layout,
  cart,
}: {
  layout: 'page' | 'aside';
  cart?: CartApiQueryFragment | null;
}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="cart-details" style={{ padding: '1rem' }}>
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

function CartLines({
  lines,
  layout,
}: {
  layout: 'page' | 'aside';
  lines?: CartApiQueryFragment['lines'];
}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines" style={{ marginBottom: '2rem' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {lines.edges.map(({node}) => (
          <CartLineItem key={node.id} line={node} />
        ))}
      </ul>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <a 
        href={checkoutUrl}
        target="_self"
        style={{
          display: 'block',
          width: '100%',
          padding: '1rem',
          backgroundColor: '#000',
          color: 'white',
          textAlign: 'center',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        Continue to Checkout →
      </a>
      <br />
    </div>
  );
}

function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost?: CartApiQueryFragment['cost'];
  layout: 'page' | 'aside';
}) {
  return (
    <div 
      aria-labelledby="cart-summary"
      style={{
        borderTop: '1px solid #e5e5e5',
        paddingTop: '1rem',
      }}
    >
      <h4 style={{ marginBottom: '1rem' }}>Order Summary</h4>
      <dl className="cart-subtotal" style={{ marginBottom: '1rem' }}>
        <dt style={{ display: 'inline-block', marginRight: '0.5rem' }}>
          Subtotal
        </dt>
        <dd style={{ display: 'inline-block', fontWeight: 'bold' }}>
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      {children}
    </div>
  );
}

function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: 'page' | 'aside';
}) {
  return (
    <div 
      hidden={hidden}
      style={{
        padding: '4rem 2rem',
        textAlign: 'center',
      }}
    >
      <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Looks like you haven't added anything yet, let's get you started!
      </p>
      <Link
        to="/collections/all"
        onClick={layout === 'aside' ? () => {} : undefined}
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          backgroundColor: '#000',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Continue shopping →
      </Link>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div style={{ marginBottom: '1rem' }}>
      <dl hidden={!codes.length}>
        <div>
          <dt style={{ display: 'inline-block', marginRight: '0.5rem' }}>
            Discount(s)
          </dt>
          <dd style={{ display: 'inline-block' }}>
            {codes?.map((code) => (
              <CartDiscountCode key={code} code={code} />
            ))}
          </dd>
        </div>
      </dl>

      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.DiscountCodesUpdate}
      >
        {(fetcher) => (
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
              Have a discount code?
            </summary>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="text"
                name="discountCode"
                placeholder="Discount code"
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Apply
              </button>
            </div>
          </details>
        )}
      </CartForm>
    </div>
  );
}

function CartDiscountCode({code}: {code: string}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{discountCodes: ['']}}
    >
      <span style={{ marginRight: '0.5rem' }}>{code}</span>
      <button
        type="submit"
        style={{
          background: 'none',
          border: 'none',
          color: '#999',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}
      >
        Remove
      </button>
    </CartForm>
  );
}