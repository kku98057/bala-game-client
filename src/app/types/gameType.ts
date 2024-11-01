export type GameProps = {
  name: string;
  imageUrl: string;
  id: number;
  balanceGameId: number;
};

export interface BalanceGameProps {
  title: string;
  items: GameProps[];
  participantCount: number;
}

export interface BalanceGameList extends BalanceGameProps {
  id: number;
  username: string;
  createdAt: string;
  itemsCount?: number;
}

export interface BalanceGameListResponse {
  games: BalanceGameList[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  list: number;
}
