import {createContext, useContext, useState, useCallback, ReactNode} from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'lang';

interface AsideContext {
  type: AsideType | null;
  open: (type: AsideType) => void;
  close: () => void;
}

const AsideContext = createContext<AsideContext | undefined>(undefined);

export function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType | null>(null);

  const open = useCallback((newType: AsideType) => {
    setType(newType);
  }, []);

  const close = useCallback(() => {
    setType(null);
  }, []);

  return (
    <AsideContext.Provider value={{type, open, close}}>
      {children}
    </AsideContext.Provider>
  );
}

export function useAside() {
  const context = useContext(AsideContext);
  if (context === undefined) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return context;
}

export function Aside({
  children,
  className,
  heading,
  id = 'aside',
}: {
  children?: ReactNode;
  className?: string;
  heading: ReactNode;
  id?: string;
}) {
  const {type, close} = useAside();

  return (
    <div
      aria-modal
      className={`overlay ${type ? 'overlay--open' : ''} ${className || ''}`}
      id={id}
      role="dialog"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: type ? 'flex' : 'none',
        justifyContent: 'flex-end',
      }}
    >
      <button
        className="close-outside"
        onClick={close}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      />
      <aside
        style={{
          width: '400px',
          maxWidth: '90vw',
          height: '100%',
          backgroundColor: 'white',
          padding: '1rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="aside-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem',
          borderBottom: '1px solid #eee',
          paddingBottom: '1rem',
        }}>
          <h3 style={{ margin: 0 }}>{heading}</h3>
          <button
            className="close-icon"
            onClick={close}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            ×
          </button>
        </div>
        <main id="aside-content" style={{ flex: 1 }}>
          {children}
        </main>
      </aside>
    </div>
  );
}
