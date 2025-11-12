import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import {
  Card,
  Input,
  Button,
  Spin,
  Typography,
  Popconfirm,
  Row,
  Col,
  Badge,
  Space,
  Select
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CommentOutlined, SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { usePostContext } from '../contexts/PostContext';
import AddNewPost from '../components/models/AddNewPost';
import { CommentsModal } from '../components/models/CommentsModal';
import type { Post } from '../types/posts';
import '../styles/PostsPage.css';
import { debounce } from '../utils/debounce';

const { Title, Paragraph } = Typography;

export const PostsPage: React.FC = () => {
  const {
    posts,
    loading,
    searchLoading,
    hasMore,
    comments,
    loadingComments,
    handleSearch,
    handleDeletePost,
    loadMorePosts,
    loadComments,
    setIsAddModalVisible,
    setEditingPost,
  } = usePostContext();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<'latest' | 'alphabetical'>('latest');
  const observerTarget = useRef<HTMLDivElement>(null);
  const approved_comments = localStorage.getItem('approved_comments') || "0";

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !loading) {
      loadMorePosts();
    }
  }, [hasMore, loading, loadMorePosts]);

  useEffect(() => {
    const element = observerTarget.current;
    const option = { threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);

    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsAddModalVisible(true);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsCommentsModalVisible(true);
    loadComments(post.id);
  };

  const handleCloseModal = () => {
    setIsCommentsModalVisible(false);
    setSelectedPost(null);
  };

  const sortedPosts = useMemo(() => {
    const postsCopy = [...posts];
    if (sortOrder === 'alphabetical') {
      return postsCopy.sort((a, b) => a.title.localeCompare(b.title));
    }
    return postsCopy;
  }, [posts, sortOrder]);

  const renderPosts = useMemo(() => {
    return sortedPosts.map((post: Post) => {

      return (
        <Col key={post.id} xs={24} sm={12} lg={8} xl={6} className="post-card-col">
          <Card
            className="post-card"
            hoverable
            extra={
              <Badge
                status={post.completed ? "success" : "warning"}
                text={post.completed ? "Completed" : "Pending"}
                className="post-status-badge"
              />
            }
            actions={[
              <Button
                type="text"
                icon={<CommentOutlined />}
                onClick={() => handlePostClick(post)}
                className="action-button comment-button"
              >
                Comments
              </Button>,
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(post)}
                className="action-button edit-button"
              >
                Edit
              </Button>,
              <Popconfirm
                title="Delete post"
                description="Are you sure you want to delete this post?"
                onConfirm={() => handleDeletePost(post.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  className="action-button delete-button"
                >
                  Delete
                </Button>
              </Popconfirm>
            ]}
          >
            <div className="post-card-content">
              <Title level={5} className="post-title">
                {post.title}
              </Title>
              <Paragraph className="post-body" ellipsis={{ rows: 4 }}>
                {post.body}
              </Paragraph>
            </div>
          </Card>
        </Col>
      );
    });
  }, [sortedPosts, comments])

  return (
    <div className="posts-page-container">
      <p className='block'>Total Approved comments are {approved_comments}</p>
      <div className="posts-controls">
        <Space.Compact size="large" className="search-input" style={{ width: '100%' }}>
          <Input
            placeholder="Search posts by title..."
            allowClear
            onChange={debounce((e) => handleSearch(e.target.value), 700)}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            loading={searchLoading}
          />
        </Space.Compact>
        <Space size="middle">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsAddModalVisible(true)}
          >
            Add Post
          </Button>
        </Space>
        <Space size="middle">
          <Select
            value={sortOrder}
            onChange={setSortOrder}
            size="large"
            style={{ width: 150 }}
            suffixIcon={<SortAscendingOutlined />}
            options={[
              { value: 'latest', label: 'Latest' },
              { value: 'alphabetical', label: 'Alphabetical' }
            ]}
          />
        </Space>
      </div>


      {posts.length === 0 && !loading && (
        <div className="no-posts">
          <Title level={3}>No posts found</Title>
        </div>
      )}
      <Row gutter={[24, 24]} className="posts-grid">
        {renderPosts}
      </Row>

      {loading && (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      )}

      <div ref={observerTarget} className="observer-target" />

      <AddNewPost />

      <CommentsModal
        visible={isCommentsModalVisible}
        post={selectedPost}
        comments={selectedPost ? comments[selectedPost.id] || [] : []}
        loading={selectedPost ? loadingComments[selectedPost.id] || false : false}
        onClose={handleCloseModal}
      />
    </div>
  );
};