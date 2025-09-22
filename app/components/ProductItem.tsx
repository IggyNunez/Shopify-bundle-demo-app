import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {BundleBadge} from '~/components/BundleBadge';

export function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const isBundle = product?.isBundle?.requiresComponents;

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        transition: 'transform 0.2s ease',
      }}
    >
      <div style={{ position: 'relative' }}>
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              marginBottom: '0.5rem',
            }}
          />
        )}
        {isBundle && <BundleBadge />}
        
        <div style={{ padding: '0.5rem 0' }}>
          <h4 style={{ 
            margin: '0 0 0.25rem 0',
            fontSize: '1rem',
            fontWeight: '500',
            lineHeight: '1.4',
          }}>
            {product.title}
          </h4>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Money 
              data={product.priceRange.minVariantPrice} 
              as="span"
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#333',
              }}
            />
            {product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount && (
              <>
                <span style={{ color: '#999', fontSize: '0.75rem' }}>-</span>
                <Money 
                  data={product.priceRange.maxVariantPrice} 
                  as="span"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#333',
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
