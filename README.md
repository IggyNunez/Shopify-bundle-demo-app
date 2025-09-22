# Shopify Bundle App for Hydrogen

A complete implementation of Shopify Bundles functionality for Hydrogen storefronts, based on the latest Shopify documentation and best practices.

## Features

- **Bundle Badge Display**: Automatically shows "BUNDLE" badges on product listings and cart items
- **Bundle Product Information**: Displays detailed information about bundled products on product pages
- **Enhanced Cart Experience**: Shows bundle indicators in cart line items
- **GraphQL Integration**: Proper querying for bundle data using Shopify's bundle fields
- **Responsive Design**: Mobile-friendly implementation with modern CSS
- **TypeScript Support**: Fully typed components and interfaces

## What's Included

### Components

- `BundleBadge.tsx` - Displays "BUNDLE" badge on products
- `BundledVariants.tsx` - Shows the products included in a bundle
- `ProductForm.tsx` - Enhanced product form with bundle-specific cart button text
- `ProductImage.tsx` - Product image component with bundle badge support
- `ProductItem.tsx` - Product listing item with bundle indicators
- `CartLineItem.tsx` - Cart line item with bundle information
- `ProductPrice.tsx` - Price display component
- `Aside.tsx` - Cart sidebar component

### GraphQL Fragments

- Complete fragments for querying bundle data
- Support for `requiresComponents` field detection
- Proper cart and product queries for bundle information

### Routes

- `products.$handle.tsx` - Product page with bundle support
- `collections.$handle.tsx` - Collection page with bundle listings

### Styling

- `app.css` - Complete stylesheet with bundle-specific styles
- Responsive design for mobile and desktop
- Modern CSS with smooth transitions and hover effects

## Setup Instructions

### Prerequisites

1. **Install Shopify Bundles App**: Install the [Shopify Bundles app](https://apps.shopify.com/shopify-bundles) in your Shopify admin
2. **Verify Eligibility**: Ensure your store meets the [eligibility requirements](https://help.shopify.com/en/manual/products/bundles/eligibility-and-considerations)
3. **Create Bundles**: Create your first bundle using the Shopify Bundles app

### Installation

1. **Copy Components**: Copy all files from this bundle app to your Hydrogen project
2. **Update Dependencies**: Ensure you have the latest version of `@shopify/hydrogen`
3. **Install Required Packages**:
   ```bash
   npm install @shopify/hydrogen @shopify/remix-oxygen react-router
   ```

### Integration Steps

#### 1. Update Your Project Structure

```
your-hydrogen-app/
├── app/
│   ├── components/
│   │   ├── BundleBadge.tsx
│   │   ├── BundledVariants.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductImage.tsx
│   │   ├── ProductItem.tsx
│   │   ├── CartLineItem.tsx
│   │   └── ...
│   ├── routes/
│   │   ├── products.$handle.tsx
│   │   ├── collections.$handle.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── fragments.ts
│   │   ├── variants.tsx
│   │   └── ...
│   └── styles/
│       └── app.css
```

#### 2. Update Root Layout

Add the CSS import to your root layout:

```tsx
import './styles/app.css';
```

#### 3. Update Existing Components

Replace or update your existing components with the bundle-aware versions:

- Replace `ProductForm` with the bundle-aware version
- Update `ProductImage` to include bundle badge support
- Update `ProductItem` for collection listings
- Update `CartLineItem` for cart functionality

#### 4. Update GraphQL Queries

Ensure your GraphQL queries include the bundle-specific fields:

```graphql
# Add to your product queries
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
  }
}
```

## Component Usage

### Bundle Badge

```tsx
import { BundleBadge } from '~/components/BundleBadge';

// Use conditionally based on bundle status
{isBundle && <BundleBadge />}
```

### Bundled Variants

```tsx
import { BundledVariants } from '~/components/BundledVariants';

// Display bundled products on product page
{isBundle && (
  <BundledVariants variants={bundledVariants} />
)}
```

### Product Form

```tsx
import { ProductForm } from '~/components/ProductForm';

<ProductForm
  productOptions={productOptions}
  selectedVariant={selectedVariant}
  isBundle={isBundle}
/>
```

## Styling Customization

The app includes comprehensive CSS styling that can be customized:

### Bundle Badge Styling

```css
.bundle-badge {
  background: #10804c; /* Change to your brand color */
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
}
```

### Bundle Variants Styling

```css
.bundled-variants {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
}
```

## GraphQL Schema

The app uses the following key bundle-related fields:

- `requiresComponents` - Boolean indicating if product is a bundle
- `components` - Array of bundled products with quantities
- `groupedBy` - Related bundle information

## Testing

### Test Bundle Creation

1. Create a test bundle in your Shopify admin
2. Verify the bundle appears on your storefront with badge
3. Test adding bundle to cart
4. Verify cart shows bundle information
5. Place a test order to confirm functionality

### Visual Testing

- Check bundle badges appear on product listings
- Verify bundle information displays on product pages
- Test responsive design on mobile devices
- Ensure cart properly shows bundle indicators

## Troubleshooting

### Common Issues

1. **Bundle Badge Not Showing**: Verify GraphQL queries include `requiresComponents` field
2. **Bundle Products Not Loading**: Check `components` query and ensure proper fragment usage
3. **Styling Issues**: Verify CSS import in root layout
4. **TypeScript Errors**: Ensure all type imports are correct and up to date

### Debug Bundle Detection

Add debug logging to check bundle status:

```tsx
console.log('Is Bundle:', product?.isBundle?.requiresComponents);
console.log('Bundle Components:', product?.isBundle?.components?.nodes);
```

## Performance Considerations

- Bundle queries are optimized with proper fragments
- Images use lazy loading for better performance
- CSS uses modern properties with fallbacks
- Components are designed for code splitting

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile Safari and Chrome
- Progressive enhancement for older browsers

## Contributing

To contribute to this bundle implementation:

1. Follow Shopify's latest bundle documentation
2. Maintain TypeScript types
3. Test on multiple devices and browsers
4. Keep accessibility in mind
5. Follow existing code patterns

## Resources

- [Shopify Bundles Documentation](https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/bundles)
- [Shopify Bundles App](https://apps.shopify.com/shopify-bundles)
- [Hydrogen Documentation](https://shopify.dev/docs/custom-storefronts/hydrogen)
- [GraphQL Admin API Reference](https://shopify.dev/docs/api/admin-graphql)

## License

This bundle app implementation follows Shopify's development guidelines and is provided as a reference implementation.
