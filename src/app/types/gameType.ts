export type GameProps = {
  name: string;
  imageUrl: string;
  id: number;
  tournamentId: number;
};

export interface TournamentGameProps {
  title: string;
  items: GameProps[];
  participantCount: number;
}

export interface TournamentList extends TournamentGameProps {
  id: number;
  username: string;
  createdAt: string;
  itemsCount?: number;
}

export interface TournamentListResponse {
  games: TournamentList[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  list: number;
}
export interface GameStatistics {
  username: string;
  createdAt: string;
  totalCount: number;
  items: {
    id: number;
    name: string;
    imageUrl: string;
    count: number;
    percentage: number;
  }[];
}
