import {type LoaderFunctionArgs, defer, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getVariantUrl,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import type {ProductVariantComponent} from '@shopify/hydrogen/storefront-api-types';
import {BundledVariants} from '~/components/BundledVariants';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {name: 'description', content: data?.product.description ?? ''},
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    redirectIfHandleIsLocalized({
      request,
      context,
      pathname: `/products/${handle}`,
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.edges[0]?.node;
  const firstVariantIsDefault = Boolean(
    firstVariant?.selectedOptions.find((option) =>
      option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  return {
    product,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    product.variants,
  );

  const {title, descriptionHtml} = product;
  const isBundle = Boolean(product.isBundle?.requiresComponents);
  const bundledVariants = isBundle ? product.isBundle?.components.nodes : null;

  return (
    <div className="product" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem' }}>
      <ProductImage image={selectedVariant?.image} isBundle={isBundle} />
      <div className="product-main">
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h1>
        <ProductPrice selectedVariant={selectedVariant} />
        <br />
        <ProductForm
          product={product}
          selectedVariant={selectedVariant}
          variants={product.variants}
          isBundle={isBundle}
        />
        <br />
        <br />
        <p>
          <strong>Description</strong>
        </p>
        <br />
        <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        <br />
        {isBundle && (
          <div>
            <h4>Bundled Products</h4>
            <BundledVariants
              variants={bundledVariants as ProductVariantComponent[]}
            />
          </div>
        )}
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    requiresComponents
    components(first: 10) {
      nodes {
        productVariant {
          id
          title
          product {
            handle
          }
        }
        quantity
      }
    }
    groupedBy(first: 10) {
      nodes {
        id
        title
        product {
          handle
        }
      }
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      edges {
        node {
          ...ProductVariant
        }
      }
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    # Check if the product is a bundle
    isBundle: selectedOrFirstAvailableVariant(ignoreUnknownOptions: true, selectedOptions: { name: "", value: ""}) {
      ...on ProductVariant {
        requiresComponents
        components(first: 100) {
           nodes {
              productVariant {
                ...ProductVariant
              }
              quantity
           }
        }
        groupedBy(first: 100) {
          nodes {
              id
            }
          }
        }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

function redirectToFirstVariant({
  product,
  request,
}: {
  product: any;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.edges[0]?.node;

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}
