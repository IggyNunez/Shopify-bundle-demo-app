import {Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {Link, useLocation} from '@remix-run/react';
import {ReactNode} from 'react';

export function PaginatedResourceSection<T>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: {
    edges: Array<{node: T}>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
  children: (props: {node: T; index: number}) => ReactNode;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({
        nodes,
        isLoading,
        PreviousLink,
        NextLink,
        hasNextPage,
        hasPreviousPage,
      }) => (
        <>
          <PreviousButton
            isLoading={isLoading}
            PreviousLink={PreviousLink}
            hasPreviousPage={hasPreviousPage}
          />
          <div className={resourcesClassName}>
            {nodes.map((node, index) => children({node, index}))}
          </div>
          <NextButton
            isLoading={isLoading}
            NextLink={NextLink}
            hasNextPage={hasNextPage}
          />
        </>
      )}
    </Pagination>
  );
}

function PreviousButton({
  isLoading,
  PreviousLink,
  hasPreviousPage,
}: {
  isLoading: boolean;
  PreviousLink: any;
  hasPreviousPage: boolean;
}) {
  return hasPreviousPage ? (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <PreviousLink
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          backgroundColor: isLoading ? '#ccc' : '#000',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'wait' : 'pointer',
          pointerEvents: isLoading ? 'none' : 'auto',
        }}
      >
        {isLoading ? 'Loading...' : '← Load previous'}
      </PreviousLink>
    </div>
  ) : null;
}

function NextButton({
  isLoading,
  NextLink,
  hasNextPage,
}: {
  isLoading: boolean;
  NextLink: any;
  hasNextPage: boolean;
}) {
  return hasNextPage ? (
    <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
      <NextLink
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          backgroundColor: isLoading ? '#ccc' : '#000',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'wait' : 'pointer',
          pointerEvents: isLoading ? 'none' : 'auto',
        }}
      >
        {isLoading ? 'Loading...' : 'Load more →'}
      </NextLink>
    </div>
  ) : null;
}