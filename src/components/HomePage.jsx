import React from 'react';
import { Layout } from './Layout.jsx';
import { allProjects } from '../data/projects.js';
import { friendLinks } from '../data/friends.js';

export function HomePage({ posts }) {
  // 学习笔记 = 自定义 HTML 研报；文章 = markdown
  const notes = posts.filter((p) => p.type === 'custom');
  const articles = posts.filter((p) => p.type !== 'custom');

  const entry = (post) => (
    <li key={post.slug} className="entry-item">
      <a className="entry" href={post.url}>
        <time dateTime={post.date}>{post.date.replace(/-/g, '.')}</time>
        <span className="entry-title">{post.title}</span>
      </a>
    </li>
  );

  return (
    <Layout className="layout-home">
      <div className="home-grid">
        {/* 第一列：身份 + 作品 */}
        <aside className="home-side">
          <header className="home-header">
            <div className="campfire" aria-hidden="true"></div>
            <h1 className="home-name">王雨峰的博客</h1>
            <p className="home-tagline">「人类在黑夜中的一种本能，也许就是和自己信任的人，围绕在篝火面前取暖。」</p>
            <p className="home-source">—— 《<a href="/posts/20251207.html">AI时代的篝火</a>》</p>
            <nav className="hero-links">
              <a href="https://github.com/wangyufeng0615" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="mailto:alanwang424@gmail.com">Email</a>
            </nav>
          </header>

          <section className="home-works">
            <h2 className="home-h2">作品</h2>
            <ul className="works-list">
              {allProjects.map((p) => (
                <li key={p.name} className="work">
                  <span className="work-sticker" aria-hidden="true"></span>
                  <span className="work-text">
                    <a className="work-name" href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
                    <span className="work-desc">{p.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="home-friends">
            <h2 className="home-h2">友链</h2>
            <ul className="friends-list">
              {friendLinks.map((friend) => (
                <li key={friend.url} className="friend-item">
                  <a className="friend-link" href={friend.url} target="_blank" rel="noopener noreferrer">
                    <span className="friend-mark" aria-hidden="true"></span>
                    <span className="friend-name">{friend.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* 第二列：文章 */}
        <main className="home-feed">
          <section className="home-writing">
            <h2 className="home-h2">文章<span className="home-count">{articles.length}</span></h2>
            <ul className="entry-list">
              {articles.map(entry)}
            </ul>
          </section>
        </main>

        {/* 第三列：学习笔记 */}
        <aside className="home-notes-col">
          <section className="home-notes">
            <h2 className="home-h2">学习笔记</h2>
            <ul className="entry-list note-list">
              {notes.map(entry)}
            </ul>
          </section>
        </aside>
      </div>

      <footer className="home-end">
        <p className="home-machine">
          <a href="/llms.txt">llms.txt</a>
          <a href="/posts.json">posts.json</a>
          <a href="/projects.json">projects.json</a>
          <a href="/sitemap.xml">sitemap.xml</a>
        </p>
      </footer>
    </Layout>
  );
}
