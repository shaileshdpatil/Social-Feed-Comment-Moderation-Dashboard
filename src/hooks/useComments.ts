import { message } from 'antd';
import { postsApi } from '../APIs/posts';
import type { CommentStatus } from '../types/posts';

const updateApprovedComments = (type: "approved" | "rejected" | "pending" = "approved") => {
  const approvedCount = Number(localStorage.getItem("approved_comments") || "0");
  if (type === "approved") {
    localStorage.setItem("approved_comments", String(approvedCount + 1));
  } else {
    localStorage.setItem("approved_comments", String(approvedCount - 1));
  }
};

export const useComments = (dispatch: any, state: any) => {
  const loadComments = async (postId: number) => {
    if (state.comments[postId]) return;

    dispatch({ type: 'SET_COMMENT_LOADING', payload: { postId, value: true } });
    try {
      const postComments = await postsApi.getPostComments(postId);
      const commentsWithStatus = postComments.map(comment => ({
        ...comment,
        status: comment.status || 'pending' as CommentStatus
      }));
      dispatch({ type: 'SET_COMMENTS', payload: { postId, comments: commentsWithStatus } });
    } catch (error) {
      message.error('Failed to load comments');
    } finally {
      dispatch({ type: 'SET_COMMENT_LOADING', payload: { postId, value: false } });
    }
  };

  const handleAddComment = async (postId: number, values: any) => {
    try {
      const newComment = await postsApi.addComment({
        postId,
        name: values.name,
        email: values.email,
        body: values.body,
        status: 'pending'
      });
      dispatch({ type: 'ADD_COMMENT', payload: { postId, comment: newComment } });
      updateApprovedComments("approved");
      message.success('Comment added successfully');
    } catch (error) {
      message.error('Failed to add comment');
      throw error;
    }
  };

  const handleUpdateComment = async (postId: number, commentId: number, values: any) => {
    try {
      await postsApi.updateComment(commentId, {
        name: values.name,
        email: values.email,
        body: values.body
      });
      dispatch({ type: 'UPDATE_COMMENT', payload: { postId, commentId, data: values } });
      message.success('Comment updated successfully');
    } catch (error) {
      message.error('Failed to update comment');
      throw error;
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      await postsApi.deleteComment(commentId);
      dispatch({ type: 'DELETE_COMMENT', payload: { postId, commentId } });
      updateApprovedComments("approved");
      message.success('Comment deleted successfully');
    } catch (error) {
      message.error('Failed to delete comment');
    }
  };

  const handleChangeCommentStatus = async (postId: number, commentId: number, status: CommentStatus) => {
    try {
      await postsApi.updateComment(commentId, { status });
      dispatch({ type: 'UPDATE_COMMENT', payload: { postId, commentId, data: { status } } });
      updateApprovedComments(status);
      message.success(`Comment ${status}`);
    } catch (error) {
      message.error('Failed to update comment status');
    }
  };

  return {
    loadComments,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleChangeCommentStatus,
  };
};
