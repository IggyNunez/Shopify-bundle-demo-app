import {useNavigate} from '@remix-run/react';
import {
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {useAside} from './Aside';

export function ProductForm({
  product,
  productOptions,
  selectedVariant,
  variants,
  isBundle = false,
}: {
  product: any;
  productOptions?: Array<{name: string; values: Array<{value: string; isAvailable: boolean}>}>;
  selectedVariant: any;
  variants?: any;
  isBundle?: boolean;
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  return (
    <div className="product-form">
      <VariantSelector
        handle={product?.handle || selectedVariant?.product?.handle || ''}
        options={productOptions || []}
        variants={variants || product?.variants || []}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale
          ? isBundle
            ? 'Add bundle to cart'
            : 'Add to cart'
          : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: any}) {
  return (
    <div className="product-option" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-option-values">
        {option.values.map(({value, isAvailable, isActive, to}: any) => {
          return (
            <ProductOptionLink
              key={option.name + value}
              to={to}
              active={isActive}
              disabled={!isAvailable}
            >
              {value}
            </ProductOptionLink>
          );
        })}
      </div>
    </div>
  );
}

function ProductOptionLink({
  to,
  active,
  disabled,
  children,
}: {
  to: string;
  active: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  
  return (
    <button
      className={`product-option-link ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      disabled={disabled}
      onClick={() => navigate(to)}
      style={{
        padding: '0.5rem 1rem',
        margin: '0.25rem',
        border: active ? '2px solid #000' : '1px solid #ccc',
        backgroundColor: disabled ? '#f5f5f5' : active ? '#000' : 'white',
        color: disabled ? '#999' : active ? 'white' : '#000',
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: '4px',
      }}
    >
      {children}
    </button>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<any>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: any) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            style={{
              backgroundColor: disabled ? '#ccc' : '#000',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              width: '100%',
            }}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
