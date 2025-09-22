import {OptimisticCartLine, useOptimisticCart, Image, CartForm} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {useVariantUrl} from '~/lib/variants';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {BundleBadge} from '~/components/BundleBadge';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({line}: {line: CartLine}) {
  const optimisticCart = useOptimisticCart();
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const isBundle = Boolean(line.merchandise.requiresComponents);

  return (
    <li key={id} className="cart-line">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          loading="lazy"
          width={100}
          style={{
            borderRadius: '8px',
            objectFit: 'cover',
          }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.5rem' }}>
        <Link
          style={{ position: 'relative', textDecoration: 'none', color: 'inherit' }}
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (close) {
              close();
            }
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ maxWidth: '60%', margin: 0, fontWeight: '500' }}>
              <strong>{product.title}</strong>
            </p>
            {isBundle && <BundleBadge />}
          </div>
          
          {selectedOptions.map((option) => (
            <small key={option.name} style={{ color: '#666', display: 'block' }}>
              {option.name}: {option.value}
            </small>
          ))}
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ProductPrice price={line?.cost?.totalAmount} />
          <CartLineQuantity line={line} />
        </div>
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <small style={{ minWidth: '60px', textAlign: 'center' }}>Qty: {quantity}</small>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span>−</span>
        </button>
      </CartLineUpdateButton>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span>+</span>
        </button>
      </CartLineUpdateButton>
      <CartLineUpdateButton lines={[{id: lineId, quantity: 0}]}>
        <button
          aria-label="Remove from cart"
          disabled={!!isOptimistic}
          style={{
            background: 'none',
            border: 'none',
            color: '#999',
            cursor: 'pointer',
            fontSize: '0.875rem',
            textDecoration: 'underline',
          }}
        >
          Remove
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: Array<{id: string; quantity: number}>;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
