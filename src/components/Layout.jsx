import React from 'react';

export function Layout({ children, className = '' }) {
  return (
    <div className={['layout', className].filter(Boolean).join(' ')}>
      <main className="main">
        {children}
      </main>
    </div>
  );
}
