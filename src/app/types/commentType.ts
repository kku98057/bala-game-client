export interface CommentProps {
  id: number;
  gameId: number;
  nickname: string;
  content: string;
  createdAt: string;
  likes?: number;
}
