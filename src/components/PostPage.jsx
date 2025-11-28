import React from 'react';
import { Layout } from './Layout.jsx';
import { PostDetail } from './PostDetail.jsx';

export function PostPage({ title, date, content }) {
  return (
    <Layout>
      <PostDetail title={title} date={date} content={content} />
    </Layout>
  );
}
