import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Form } from 'antd';
import type { Post, Comment, CommentStatus } from '../types/posts';
import { postReducer, initialState } from '../store/postReducer';
import { usePosts } from '../hooks/usePosts';
import { useComments } from '../hooks/useComments';

interface PostContextType {
  posts: Post[];
  comments: { [key: number]: Comment[] };
  
  loading: boolean;
  searchLoading: boolean;
  submitLoading: boolean;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  isAddModalVisible: boolean;
  editingPost: Post | null;
  loadingComments: { [key: number]: boolean };
  hasMore: boolean;
  
  form: any;
  loadPosts: (page?: number) => Promise<void>;
  loadMorePosts: () => Promise<void>;
  handleSearch: (value: string) => Promise<void>;
  loadComments: (postId: number) => Promise<void>;
  handleAddPost: (values: any) => Promise<void>;
  handleUpdatePost: (values: any) => Promise<void>;
  handleDeletePost: (postId: number) => Promise<void>;
  handlePageChange: (page: number) => void;
  setIsAddModalVisible: (visible: boolean) => void;
  setEditingPost: (post: Post | null) => void;
  handleAddComment: (postId: number, values: any) => Promise<void>;
  handleUpdateComment: (postId: number, commentId: number, values: any) => Promise<void>;
  handleDeleteComment: (postId: number, commentId: number) => Promise<void>;
  handleChangeCommentStatus: (postId: number, commentId: number, status: CommentStatus) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);
  const [form] = Form.useForm();

  const postActions = usePosts(dispatch, state);
  const commentActions = useComments(dispatch, state);

  useEffect(() => {
    postActions.loadPosts();
  }, []);

  const setIsAddModalVisible = (visible: boolean) => {
    dispatch({ type: 'SET_MODAL', payload: { isVisible: visible } });
  };

  const setEditingPost = (post: Post | null) => {
    dispatch({ type: 'SET_MODAL', payload: { editingPost: post } });
  };

  const value: PostContextType = {
    posts: state.posts,
    comments: state.comments,
    loading: state.loading.posts,
    searchLoading: state.loading.search,
    submitLoading: state.loading.submit,
    currentPage: state.pagination.currentPage,
    pageSize: state.pagination.pageSize,
    searchQuery: state.search.query,
    isAddModalVisible: state.modal.isVisible,
    editingPost: state.modal.editingPost,
    loadingComments: state.loading.comments,
    hasMore: state.pagination.hasMore,
    form,
    ...postActions,
    ...commentActions,
    handleAddPost: (values: any) => postActions.handleAddPost(values, form),
    handleUpdatePost: (values: any) => postActions.handleUpdatePost(values, form),
    setIsAddModalVisible,
    setEditingPost,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};