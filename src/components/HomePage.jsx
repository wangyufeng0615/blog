import React from 'react';
import { Layout } from './Layout.jsx';
import { allProjects } from '../data/projects.js';

// posts 已按日期倒序，按年份切组
function groupByYear(posts) {
  const groups = [];
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    const last = groups[groups.length - 1];
    if (last && last.year === year) {
      last.posts.push(post);
    } else {
      groups.push({ year, posts: [post] });
    }
  }
  return groups;
}

export function HomePage({ posts }) {
  const yearGroups = groupByYear(posts);

  return (
    <Layout className="layout-home">
      <header className="home-header">
        <img src="/avatar.jpg" alt="王雨峰" className="home-avatar" />
        <h1 className="home-name">王雨峰</h1>
        <p className="home-tagline">写于 2019 年至今的个人博客，一个小小的赛博空间。</p>
        <p className="home-contact">
          <a href="https://github.com/wangyufeng0615" target="_blank" rel="noopener noreferrer">github.com/wangyufeng0615</a>
          <span className="home-contact-sep" aria-hidden="true">/</span>
          <a href="mailto:alanwang424@gmail.com">alanwang424@gmail.com</a>
        </p>
      </header>

      <section className="home-works" aria-labelledby="works-title">
        <h2 className="home-h2" id="works-title">作品</h2>
        <ul className="works-list">
          {allProjects.map((p) => (
            <li key={p.name} className="work">
              <a className="work-name" href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
              <p className="work-desc">{p.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-writing" aria-labelledby="writing-title">
        <h2 className="home-h2" id="writing-title">
          文章<span className="home-count">{posts.length} 篇</span>
        </h2>

        {yearGroups.map((group) => (
          <section className="year-section" key={group.year}>
            <h3 className="year-heading">
              <span className="year-num">{group.year}</span>
              <span className="year-count">{group.posts.length} 篇</span>
            </h3>
            <ul className="year-list">
              {group.posts.map((post) => (
                <li key={post.slug} className="post-row-item">
                  <a className="post-row" href={post.url}>
                    <time dateTime={post.date}>{post.date.slice(5)}</time>
                    <span className="post-row-title">{post.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>

      <footer className="home-end">
        <blockquote className="home-quote">
          <p>「人类在黑夜中的一种本能，也许就是和自己信任的人，围绕在篝火面前取暖。」</p>
          <cite>
            —— <a href="/posts/20251207.html">《AI时代的篝火》，2025</a>
          </cite>
        </blockquote>
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
