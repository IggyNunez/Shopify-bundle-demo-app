import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {BundleBadge} from './BundleBadge';

export function ProductImage({
  image,
  isBundle = false,
}: {
  image: ProductVariantFragment['image'];
  isBundle?: boolean;
}) {
  if (!image) {
    return (
      <div 
        className="product-image" 
        style={{
          width: '100%',
          height: '400px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span style={{ color: '#999' }}>No image available</span>
        {isBundle && <BundleBadge />}
      </div>
    );
  }

  return (
    <div className="product-image" style={{ position: 'relative' }}>
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
        }}
      />
      {isBundle && <BundleBadge />}
    </div>
  );
}
