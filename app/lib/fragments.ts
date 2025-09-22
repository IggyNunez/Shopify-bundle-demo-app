// GraphQL fragments for bundle functionality
export const CART_QUERY_FRAGMENT = `#graphql
  fragment CartApiQuery on Cart {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      edges {
        node {
          id
          quantity
          attributes {
            key
            value
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              availableForSale
              compareAtPrice {
                ...MoneyProductItem
              }
              price {
                ...MoneyProductItem
              }
              requiresShipping
              title
              image {
                ...Image
              }
              product {
                handle
                title
                id
              }
              selectedOptions {
                name
                value
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
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        ...MoneyProductItem
      }
      totalAmount {
        ...MoneyProductItem
      }
      totalDutyAmount {
        ...MoneyProductItem
      }
      totalTaxAmount {
        ...MoneyProductItem
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      applicable
      code
    }
  }
  
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  
  fragment Image on Image {
    id
    url
    altText
    width
    height
  }
`;

export const PRODUCT_VARIANT_FRAGMENT = `#graphql
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

export const PRODUCT_FRAGMENT = `#graphql
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
    seo {
      description
      title
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
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

export const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      edges {
        node {
          selectedOptions {
            name
            value
          }
        }
      }
    }
    # Check if the product is a bundle
    isBundle: selectedOrFirstAvailableVariant(ignoreUnknownOptions: true, selectedOptions: { name: "", value: ""}) {
      ...on ProductVariant {
        requiresComponents
      }
    }
  }
  
  ${PRODUCT_VARIANT_FRAGMENT}
`;
