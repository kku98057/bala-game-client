const user = () => ["user"] as const;
const notice = {
  all: () => ["all", "notice"] as const,
  lists: (page: number, search: string) =>
    [...notice.all(), { page, search }] as const,
  list: (id: number) => [...notice.all(), { id }] as const,
  detail: (id: number) => [...notice.all(), "detail", { id }] as const,
};
const tournamentGame = {
  all: () => ["all", "tournament_game"] as const,
  lists: ({
    limit,
    sort,
    period,
  }: {
    limit: number;
    sort: "latest" | "popular" | "comments";
    period: "all" | "weekly" | "monthly";
  }) => [...tournamentGame.all(), { limit, sort, period }] as const,
  list: (id: number) => [...tournamentGame.all(), { id }] as const,
  participantCount: (id: number) =>
    [...tournamentGame.all(), "participantCount", { id }] as const,
  statistics: (id: number) =>
    [...tournamentGame.all(), "statistics", { id }] as const,

  create: () => [...tournamentGame.all(), "create"] as const,
  comments: {
    all: () => ["comments", "all"] as const,
    list: (gameId: number, currentPage: number) =>
      [
        ...tournamentGame.comments.all(),
        "list",
        { gameId, currentPage },
      ] as const,
    create: () => [...tournamentGame.comments.all(), "create"] as const,
  },
};
const balanceGame = {
  all: () => ["all", "balance_game"] as const,
  lists: ({
    limit,
    sort,
    period,
  }: {
    limit: number;
    sort: "latest" | "popular" | "comments";
    period: "all" | "weekly" | "monthly";
  }) => [...balanceGame.all(), { limit, sort, period }] as const,
  list: (id: number) => [...balanceGame.all(), { id }] as const,
  participantCount: (id: number) =>
    [...balanceGame.all(), "participantCount", { id }] as const,
  statistics: (id: number) =>
    [...balanceGame.all(), "statistics", { id }] as const,

  create: () => [...balanceGame.all(), "create"] as const,
  comments: {
    all: () => ["comments", "all"] as const,
    list: (gameId: number, currentPage: number) =>
      [...balanceGame.comments.all(), "list", { gameId, currentPage }] as const,
    create: () => [...balanceGame.comments.all(), "create"] as const,
  },
};
const profile = {
  all: () => ["all", "profile"] as const,
  games: ({ gameType }: { gameType: "BALANCE" | "TOURNAMENT" }) =>
    [...profile.all(), "games", { gameType }] as const,
};
const rankings = {
  balance: () => ["ranking", "balance"] as const,
  tournament: () => ["ranking", "tournament"] as const,
};
export const QUERYKEYS = {
  profile,
  tournamentGame,
  balanceGame,
  notice,
  rankings,
  user,
};
