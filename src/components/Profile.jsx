import React from 'react';

export function Profile() {
  return (
    <aside className="profile">
      <div className="profile-card">
        <div className="profile-info">
          <span className="profile-name">青山</span>
          <span className="profile-bio">/ 探索技术与生活的边界</span>
        </div>
        <div className="profile-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="profile-link">GitHub</a>
          <a href="#" className="profile-link">作品集</a>
          <a href="#" className="profile-link">关于</a>
        </div>
      </div>
    </aside>
  );
}
