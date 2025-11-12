export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  completed: boolean;
}

export type CommentStatus = 'pending' | 'approved' | 'rejected';

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
  status?: CommentStatus;
}

export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}