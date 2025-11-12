import type { Post, Comment } from '../types/posts';

export interface LoadingState {
  posts: boolean;
  search: boolean;
  submit: boolean;
  comments: { [key: number]: boolean };
}

export interface PostState {
  posts: Post[];
  loading: LoadingState;
  pagination: {
    currentPage: number;
    pageSize: number;
    hasMore: boolean;
  };
  search: {
    query: string;
  };
  modal: {
    isVisible: boolean;
    editingPost: Post | null;
  };
  comments: { [key: number]: Comment[] };
}

export type PostAction =
  | { type: 'SET_LOADING'; payload: { key: keyof Omit<LoadingState, 'comments'>; value: boolean } }
  | { type: 'SET_COMMENT_LOADING'; payload: { postId: number; value: boolean } }
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: number }
  | { type: 'APPEND_POSTS'; payload: Post[] }
  | { type: 'SET_PAGINATION'; payload: Partial<PostState['pagination']> }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_MODAL'; payload: Partial<PostState['modal']> }
  | { type: 'SET_COMMENTS'; payload: { postId: number; comments: Comment[] } }
  | { type: 'ADD_COMMENT'; payload: { postId: number; comment: Comment } }
  | { type: 'UPDATE_COMMENT'; payload: { postId: number; commentId: number; data: Partial<Comment> } }
  | { type: 'DELETE_COMMENT'; payload: { postId: number; commentId: number } };

export const initialState: PostState = {
  posts: [],
  loading: {
    posts: false,
    search: false,
    submit: false,
    comments: {},
  },
  pagination: {
    currentPage: 1,
    pageSize: 20,
    hasMore: true,
  },
  search: {
    query: '',
  },
  modal: {
    isVisible: false,
    editingPost: null,
  },
  comments: {},
};

export const postReducer = (state: PostState, action: PostAction): PostState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      };
    case 'SET_COMMENT_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          comments: {
            ...state.loading.comments,
            [action.payload.postId]: action.payload.value
          },
        },
      };
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post => post.id === action.payload.id ? action.payload : post),
      };
    case 'DELETE_POST':
      return { ...state, posts: state.posts.filter(post => post.id !== action.payload) };
    case 'APPEND_POSTS':
      return { ...state, posts: [...state.posts, ...action.payload] };
    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    case 'SET_SEARCH_QUERY':
      return { ...state, search: { query: action.payload } };
    case 'SET_MODAL':
      return { ...state, modal: { ...state.modal, ...action.payload } };
    case 'SET_COMMENTS':
      return {
        ...state,
        comments: { ...state.comments, [action.payload.postId]: action.payload.comments },
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.postId]: [
            ...(state.comments[action.payload.postId] || []), 
            action.payload.comment
          ],
        },
      };
    case 'UPDATE_COMMENT':
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.postId]: state.comments[action.payload.postId].map(comment =>
            comment.id === action.payload.commentId ? { ...comment, ...action.payload.data } : comment
          ),
        },
      };
    case 'DELETE_COMMENT':
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.postId]: state.comments[action.payload.postId].filter(
            comment => comment.id !== action.payload.commentId
          ),
        },
      };
    default:
      return state;
  }
};
