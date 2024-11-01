const balanceGame = {
  all: () => ["all", "balance_game"] as const,
  lists: ({ limit }: { limit: number }) =>
    [...balanceGame.all(), { limit }] as const,
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

export const QUERYKEYS = {
  balanceGame,
};
