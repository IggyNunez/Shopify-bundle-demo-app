import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
  className,
  ...props
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div className={`product-price ${className || ''}`} {...props}>
      {compareAtPrice && (
        <Money
          data={compareAtPrice}
          as="span"
          style={{
            textDecoration: 'line-through',
            color: '#999',
            marginRight: '0.5rem',
            fontSize: '0.875rem',
          }}
        />
      )}
      <Money
        data={price}
        as="span"
        style={{
          fontWeight: '600',
          color: compareAtPrice ? '#e74c3c' : '#333',
        }}
      />
    </div>
  );
}
