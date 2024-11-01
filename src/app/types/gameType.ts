export type GameProps = {
  name: string;
  imageUrl: string;
  id: number;
  balanceGameId: number;
};
export interface BalanceGameList {
  title: string;
  id: number;
  items: GameProps[];
  totalUsers: number;
  username: string;
  createdAt: string;
  itemsCount?: number;
}
export interface BalanceGameProps {
  title: string;
  items: GameProps[];
  totalUsers: number;
}
export interface BalanceGameListResponse {
  games: BalanceGameList[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  list: number;
}
