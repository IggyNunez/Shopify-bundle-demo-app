import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import type {
  ProductVariantComponent,
  Image as ShopifyImage,
} from '@shopify/hydrogen/storefront-api-types';

export function BundledVariants({
  variants,
}: {
  variants: ProductVariantComponent[];
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '1rem',
        gap: '.5rem',
      }}
    >
      {variants
        ?.map(({productVariant: bundledVariant, quantity}) => {
          const url = `/products/${bundledVariant.product.handle}`;
          return (
            <Link
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '.5rem',
                padding: '0.5rem',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background-color 0.2s ease',
              }}
              to={url}
              key={bundledVariant.id}
            >
              <Image
                alt={bundledVariant.title}
                aspectRatio="1/1"
                height={60}
                loading="lazy"
                width={60}
                data={bundledVariant.image as ShopifyImage}
                style={{
                  borderRadius: '4px',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingLeft: '1rem',
                  justifyContent: 'center',
                }}
              >
                <small style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  {bundledVariant.product.title}
                  {bundledVariant.title !== 'Default Title'
                    ? ` - ${bundledVariant.title}`
                    : null}
                </small>
                <small style={{ color: '#666' }}>Qty: {quantity}</small>
              </div>
            </Link>
          );
        })
        .filter(Boolean)}
    </div>
  );
}
