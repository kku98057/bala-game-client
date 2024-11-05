export interface BalanceGameProps {
  title: string; // 게임 제목
  username: string; // 작성자 이름
  questions: BalanceGameQuestionProps[];
}
export interface BalanceGameQuestionProps {
  title: string;
  items: { name: string }[];
}
export interface BalanceGameListProps {
  commentsCount: number;
  createdAt: string;
  id: number;
  participantCount: number;
  questionsCount: number;
  title: string;
  username: string;
}
export interface BalanceGameListResponse {
  games: BalanceGameListProps[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}
export interface BanalaceGameStatisticsProps {
  id: number;
  title: string;
  username: string;
  createdAt: string;
  commentsCount: number;
  questions: BanalaceGameItemStatisticsProps[];
}
export interface BanalaceGameItemStatisticsProps {
  id: number;
  title: string;
  participantCount: number;
  totalSelections: number;
  items: {
    id: number;
    name: string;
    selectCount: number;
    percentage: number;
  }[];
}
