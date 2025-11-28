import React from 'react';

export function PostDetail({ title, date, content }) {
  return (
    <article className="post-detail">
      <header className="post-header">
        <h1 className="post-title">{title}</h1>
        <time className="post-date">{date}</time>
      </header>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <footer className="post-footer">
        <a href="/" className="back-link">
          <span className="back-icon">←</span> 返回首页
        </a>
      </footer>
    </article>
  );
}
