import type {CodegenConfig} from '@graphql-codegen/cli';
import {pluckConfig, type PluckConfig} from '@shopify/hydrogen-codegen';

export default {
  overwrite: true,
  pluckConfig: pluckConfig as PluckConfig,
  generates: {
    'storefrontapi.generated.d.ts': {
      preset: 'client',
      schema: 'https://hydrogen-preview.myshopify.com/api/2024-10/graphql.json',
      documents: [
        './app/**/*.{ts,tsx}',
        '!./app/**/*.d.ts',
        './lib/**/*.{ts,tsx}',
        '!./lib/**/*.d.ts',
      ],
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
} as CodegenConfig;
