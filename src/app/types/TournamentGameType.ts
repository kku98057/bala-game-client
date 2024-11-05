export interface TournamentGameStatisticsProps {
  id: number;
  title: string;
  username: string;
  createdAt: string;
  commentsCount: number;
  items: TournamentGameItemStatisticsProps[];
}
export interface TournamentGameItemStatisticsProps {
  count: number;
  id: number;
  imageUrl: string;
  name: string;
  percentage: number;
}
