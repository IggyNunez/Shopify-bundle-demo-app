import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_QUERY);
  const featuredCollection = collections.edges[0]?.node;
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection?: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
      style={{
        display: 'block',
        marginBottom: '2rem',
      }}
    >
      {image && (
        <div className="featured-collection-image">
          <Image
            data={image}
            sizes="100vw"
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
            }}
          />
        </div>
      )}
      <h1 style={{
        textAlign: 'center',
        fontSize: '3rem',
        marginTop: '2rem',
      }}>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<any>;
}) {
  return (
    <div className="recommended-products" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        Recommended Products
      </h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
            }}>
              {response?.products?.edges?.map(({node}: any) => (
                <Link
                  key={node.id}
                  className="recommended-product"
                  to={`/products/${node.handle}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Image
                    data={node.images.edges[0]?.node}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                    }}
                  />
                  <h4 style={{ marginTop: '1rem' }}>{node.title}</h4>
                  <small>
                    <Money data={node.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

const FEATURED_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          ...FeaturedCollection
        }
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          ...RecommendedProduct
        }
      }
    }
  }
` as const;