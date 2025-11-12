import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { usePostContext } from '../../contexts/PostContext';

const AddNewPost: React.FC = () => {
  const { 
    isAddModalVisible, 
    setIsAddModalVisible,
    editingPost,
    setEditingPost,
    submitLoading,
    form, 
    handleAddPost,
    handleUpdatePost
  } = usePostContext();

  const isEditMode = !!editingPost;

  useEffect(() => {
    if (isAddModalVisible && editingPost) {
      form.setFieldsValue({
        title: editingPost.title,
        body: editingPost.body
      });
    } else {
      form.resetFields();
    }
  }, [isAddModalVisible, editingPost, form]);

  const handleCancel = () => {
    setIsAddModalVisible(false);
    setEditingPost(null);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    if (isEditMode) {
      handleUpdatePost(values);
    } else {
      handleAddPost(values);
    }
  };
  
  return (
    <Modal
      title={isEditMode ? "Edit Post" : "Add New Post"}
      open={isAddModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Post Title"
          rules={[
            { required: true, message: 'Please enter post title' },
            { min: 5, message: 'Title must be at least 5 characters' }
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter post title..."
          />
        </Form.Item>
        <Form.Item
          name="body"
          label="Post Body"
          rules={[
            { required: true, message: 'Please enter post body' }
          ]}
        >
          <Input.TextArea
            rows={5}
            placeholder="Enter post body..."
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel} disabled={submitLoading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              {isEditMode ? "Update Post" : "Add Post"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddNewPost;