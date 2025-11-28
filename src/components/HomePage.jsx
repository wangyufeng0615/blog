import React from 'react';
import { Layout } from './Layout.jsx';
import { Sidebar } from './Sidebar.jsx';
import { PostList } from './PostList.jsx';

export function HomePage({ posts }) {
  return (
    <Layout>
      <div className="home-container">
        <Sidebar />
        <PostList posts={posts} />
      </div>
    </Layout>
  );
}
