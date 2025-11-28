import React from 'react';

export function Sidebar() {
  const projects = [
    {
      name: '随机街景',
      desc: '随机街景 + AI 解读，我和好朋友玩的很开心',
      url: 'https://earth.wangyufeng.org'
    },
    {
      name: '提前退休计算器',
      desc: '计算你需要多少钱才能提前退休',
      url: 'https://retirement.wangyufeng.org'
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="avatar-photo"></div>
        <h1 className="name">青山</h1>
        <p className="bio">编程和写作都是我的兴趣，也许是机缘巧合，我选择了前者作为我的大学专业和工作方向。</p>
        <div className="links">
          <a href="https://github.com/wangyufeng0615" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className="email">alanwang424@gmail.com</span>
        </div>
      </div>

      <div className="sidebar-section">
        <h2 className="sidebar-title">个人作品</h2>
        <ul className="project-list">
          {projects.map((p, i) => (
            <li key={i} className="project-item">
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="project-link">
                <span className="project-name">{p.name}</span>
                <span className="project-desc">{p.desc}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
