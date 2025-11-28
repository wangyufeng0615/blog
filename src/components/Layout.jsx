import React from 'react';

export function Layout({ children }) {
  return (
    <div className="layout">
      <main className="main">
        {children}
      </main>
      <footer className="footer">
        <p>© 2024 青山</p>
      </footer>
    </div>
  );
}
