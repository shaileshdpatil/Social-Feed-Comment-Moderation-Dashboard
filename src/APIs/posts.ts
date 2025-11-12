import axios from 'axios';
import type { Post, Comment } from '../types/posts';

export const postsApi = {
  getPosts: async (page: number = 1, limit: number = 10): Promise<Post[]> => {
    const response = await axios.get(`/posts`, {
      params: {
        _page: page,
        _limit: limit
      }
    });
    return response.data;
  },

  searchPosts: async (query: string): Promise<Post[]> => {
    const response = await axios.get("/posts");
    const allPosts = response.data;
    return allPosts.filter((post: Post) => 
      post.title.toLowerCase().includes(query.toLowerCase())
    );
  },

  getPostComments: async (postId: number): Promise<Comment[]> => {
    const response = await axios.get(`/posts/${postId}/comments`);
    return response.data;
  },

  addPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
    const response = await axios.post(`/posts`, post);
    return response.data;
  },

  updatePost: async (postId: number, post: Partial<Post>): Promise<Post> => {
    const response = await axios.put(`/posts/${postId}`, post);
    return response.data;
  },

  deletePost: async (postId: number): Promise<void> => {
    await axios.delete(`/posts/${postId}`);
  },

  addComment: async (comment: Omit<Comment, 'id'>): Promise<Comment> => {
    const response = await axios.post("/comments", comment);
    return response.data;
  },

  updateComment: async (commentId: number, comment: Partial<Comment>): Promise<Comment> => {
    const response = await axios.put(`/comments/${commentId}`, comment);
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await axios.delete(`/comments/${commentId}`);
  }
};