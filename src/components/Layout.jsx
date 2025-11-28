import React from 'react';

export function Layout({ children }) {
  return (
    <div className="layout">
      <main className="main">
        {children}
      </main>
    </div>
  );
}
