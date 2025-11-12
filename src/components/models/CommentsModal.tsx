import React, { useState } from 'react';
import { Modal, Typography, Spin, List, Avatar, Button, Form, Input, Tag, Dropdown, Space } from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, MoreOutlined } from '@ant-design/icons';
import type { Post, Comment, CommentStatus } from '../../types/posts';
import { usePostContext } from '../../contexts/PostContext';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface CommentsModalProps {
  visible: boolean;
  post: Post | null;
  comments: Comment[];
  loading: boolean;
  onClose: () => void;
}

const getStatusTag = (status?: CommentStatus) => {
  switch (status) {
    case 'approved':
      return <Tag icon={<CheckCircleOutlined />} color="success">Approved</Tag>;
    case 'rejected':
      return <Tag icon={<CloseCircleOutlined />} color="error">Rejected</Tag>;
    case 'pending':
    default:
      return <Tag icon={<ClockCircleOutlined />} color="warning">Pending</Tag>;
  }
};

export const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  post,
  comments,
  loading,
  onClose
}) => {
  const { handleAddComment, handleUpdateComment, handleDeleteComment, handleChangeCommentStatus } = usePostContext();
  const [form] = Form.useForm();
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Filter out rejected comments
  const visibleComments = comments.filter(comment => comment.status !== 'rejected');

  const handleSubmitComment = async (values: any) => {
    if (!post) return;
    
    setSubmitting(true);
    try {
      if (editingCommentId) {
        await handleUpdateComment(post.id, editingCommentId, values);
        setEditingCommentId(null);
      } else {
        await handleAddComment(post.id, values);
        setIsAddingComment(false);
      }
      form.resetFields();
    } catch (error) {
      // Error handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setIsAddingComment(true);
    form.setFieldsValue({
      name: comment.name,
      email: comment.email,
      body: comment.body
    });
  };

  const handleCancelEdit = () => {
    setIsAddingComment(false);
    setEditingCommentId(null);
    form.resetFields();
  };

  const handleStatusChange = async (commentId: number, status: CommentStatus) => {
    if (!post) return;
    await handleChangeCommentStatus(post.id, commentId, status);
  };

  const handleDelete = async (commentId: number) => {
    if (!post) return;
    await handleDeleteComment(post.id, commentId);
  };
  const approvedCount = comments.filter(c => c.status === 'approved').length;

  return (
    <Modal
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {post?.title}
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Comments ({approvedCount} approved)
          </Text>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="comments-modal"
    >
      {post && (
        <>
          {!isAddingComment && (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setIsAddingComment(true)}
              style={{ marginBottom: 16, width: '100%' }}
            >
              Add Comment
            </Button>
          )}

          {isAddingComment && (
            <Form
              form={form}
              onFinish={handleSubmitComment}
              layout="vertical"
              style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="Your name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="your.email@example.com" />
              </Form.Item>
              <Form.Item
                name="body"
                label="Comment"
                rules={[
                  { required: true, message: 'Please enter your comment' },
                  { max: 200, message: 'Comment must be 200 characters or less' }
                ]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Write your comment here..." 
                  maxLength={200}
                  showCount
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    {editingCommentId ? 'Update Comment' : 'Add Comment'}
                  </Button>
                  <Button onClick={handleCancelEdit}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" tip="Loading comments..." />
            </div>
          ) : visibleComments && visibleComments.length > 0 ? (
            <List
              dataSource={visibleComments}
              renderItem={(comment) => (
                <List.Item
                  key={comment.id}
                  className="comment-item"
                  actions={[
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'edit',
                            icon: <EditOutlined />,
                            label: 'Edit',
                            onClick: () => handleEditComment(comment)
                          },
                          {
                            key: 'divider1',
                            type: 'divider'
                          },
                          {
                            key: 'approve',
                            icon: <CheckCircleOutlined />,
                            label: 'Approve',
                            onClick: () => handleStatusChange(comment.id, 'approved'),
                            disabled: comment.status === 'approved'
                          },
                          {
                            key: 'pending',
                            icon: <ClockCircleOutlined />,
                            label: 'Mark as Pending',
                            onClick: () => handleStatusChange(comment.id, 'pending'),
                            disabled: comment.status === 'pending'
                          },
                          {
                            key: 'reject',
                            icon: <CloseCircleOutlined />,
                            label: 'Reject',
                            onClick: () => handleStatusChange(comment.id, 'rejected'),
                            disabled: comment.status === 'rejected'
                          },
                          {
                            key: 'divider2',
                            type: 'divider'
                          },
                          {
                            key: 'delete',
                            icon: <DeleteOutlined />,
                            label: 'Delete',
                            danger: true,
                            onClick: () => {
                              Modal.confirm({
                                title: 'Delete Comment',
                                content: 'Are you sure you want to delete this comment?',
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk: () => handleDelete(comment.id)
                              });
                            }
                          }
                        ]
                      }}
                      trigger={['click']}
                    >
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<UserOutlined />} 
                        style={{ backgroundColor: '#1890ff' }} 
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{comment.name}</Text>
                        {getStatusTag(comment.status)}
                      </Space>
                    }
                    description={
                      <>
                        <Text 
                          type="secondary" 
                          style={{ 
                            fontSize: '12px', 
                            display: 'block', 
                            marginBottom: '8px' 
                          }}
                        >
                          {comment.email}
                        </Text>
                        <Paragraph style={{ margin: 0 }}>
                          {comment.body}
                        </Paragraph>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Text type="secondary">No comments yet</Text>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};
