import { message } from 'antd';
import { postsApi } from '../APIs/posts';

export const usePosts = (dispatch: any, state: any) => {
  const loadPosts = async (page: number = 1) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'posts', value: true } });
    try {
      const data = await postsApi.getPosts(page, state.pagination.pageSize);
      dispatch({ type: 'SET_POSTS', payload: data });
      dispatch({
        type: 'SET_PAGINATION',
        payload: { currentPage: page, hasMore: data.length === state.pagination.pageSize },
      });
    } catch (error) {
      message.error('Failed to load posts');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'posts', value: false } });
    }
  };

  const loadMorePosts = async () => {
    if (state.loading.posts || !state.pagination.hasMore || state.search.query) return;

    dispatch({ type: 'SET_LOADING', payload: { key: 'posts', value: true } });
    try {
      const nextPage = state.pagination.currentPage + 1;
      const data = await postsApi.getPosts(nextPage, state.pagination.pageSize);
      dispatch({ type: 'APPEND_POSTS', payload: data });
      dispatch({
        type: 'SET_PAGINATION',
        payload: { currentPage: nextPage, hasMore: data.length === state.pagination.pageSize },
      });
    } catch (error) {
      message.error('Failed to load more posts');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'posts', value: false } });
    }
  };

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      loadPosts(1);
      dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: { key: 'search', value: true } });
    try {
      const data = await postsApi.searchPosts(value);
      dispatch({ type: 'SET_POSTS', payload: data });
      dispatch({ type: 'SET_SEARCH_QUERY', payload: value });
      dispatch({ type: 'SET_PAGINATION', payload: { currentPage: 1 } });
    } catch (error) {
      message.error('Failed to search posts');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'search', value: false } });
    }
  };

  const handleAddPost = async (values: any, form: any) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'submit', value: true } });
    try {
      const newPost = await postsApi.addPost({
        userId: 1,
        title: values.title,
        body: values.body,
        completed: false
      });
      dispatch({ type: 'ADD_POST', payload: newPost });
      dispatch({ type: 'SET_MODAL', payload: { isVisible: false } });
      form.resetFields();
      message.success('Post added successfully');
    } catch (error) {
      message.error('Failed to add post');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'submit', value: false } });
    }
  };

  const handleUpdatePost = async (values: any, form: any) => {
    if (!state.modal.editingPost) return;

    dispatch({ type: 'SET_LOADING', payload: { key: 'submit', value: true } });
    try {
      const updatedPost = await postsApi.updatePost(state.modal.editingPost.id, {
        ...state.modal.editingPost,
        title: values.title,
        body: values.body
      });
      dispatch({ type: 'UPDATE_POST', payload: updatedPost });
      dispatch({ type: 'SET_MODAL', payload: { isVisible: false, editingPost: null } });
      form.resetFields();
      message.success('Post updated successfully');
    } catch (error) {
      message.error('Failed to update post');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'submit', value: false } });
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await postsApi.deletePost(postId);
      dispatch({ type: 'DELETE_POST', payload: postId });
      message.success('Post deleted successfully');
    } catch (error) {
      message.error('Failed to delete post');
    }
  };

  const handlePageChange = (page: number) => {
    dispatch({ type: 'SET_PAGINATION', payload: { currentPage: page } });
    if (!state.search.query) {
      loadPosts(page);
    }
  };

  return {
    loadPosts,
    loadMorePosts,
    handleSearch,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
    handlePageChange,
  };
};
