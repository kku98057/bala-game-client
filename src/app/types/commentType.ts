export interface CommentType {
  id: number;
  content: string;
  createdAt: string;
  user: {
    nickname: string;
  };
}

export interface CommentCreateResponse {
  success: boolean;
  message: string;
  data: CommentType;
}

export interface CommentListResponse {
  success: boolean;
  data: CommentType[];
}
