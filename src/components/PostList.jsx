import React from 'react';

export function PostList({ posts }) {
  return (
    <section className="post-list">
      <h2 className="section-title">文章</h2>
      <ul className="posts">
        {posts.map((post) => (
          <li key={post.slug} className="post-item">
            <a href={`/posts/${post.slug}.html`} className="post-link">
              <span className="post-date">{post.date}</span>
              <span className="post-title">{post.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
