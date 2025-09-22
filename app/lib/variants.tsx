import {useMemo} from 'react';
import {useLocation} from '@remix-run/react';

export function useVariantUrl(
  handle: string,
  selectedOptions?: Array<{name: string; value: string}>,
) {
  const {pathname, search} = useLocation();

  return useMemo(() => {
    if (!selectedOptions) {
      return `/products/${handle}`;
    }

    const searchParams = new URLSearchParams(search);
    
    selectedOptions.forEach(({name, value}) => {
      searchParams.set(name, value);
    });

    const searchString = searchParams.toString();
    return `/products/${handle}${searchString ? `?${searchString}` : ''}`;
  }, [handle, selectedOptions, pathname, search]);
}

export function getSelectedProductOptions(
  request: Request,
): Array<{name: string; value: string}> {
  const url = new URL(request.url);
  const selectedOptions: Array<{name: string; value: string}> = [];

  url.searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  return selectedOptions;
}
