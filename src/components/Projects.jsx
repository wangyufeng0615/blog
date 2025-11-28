import React from 'react';

export function Projects() {
  const projects = [
    { name: '项目 Alpha', desc: '一个实用的开发工具', url: '#' },
    { name: '项目 Beta', desc: '移动端应用', url: '#' },
    { name: '项目 Gamma', desc: '开源库', url: '#' },
    { name: '项目 Delta', desc: '数据可视化', url: '#' },
  ];

  return (
    <section className="projects">
      <h2 className="section-title">作品</h2>
      <ul className="project-list">
        {projects.map((p, i) => (
          <li key={i} className="project-item">
            <a href={p.url} className="project-link">
              <span className="project-name">{p.name}</span>
              <span className="project-desc">{p.desc}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
