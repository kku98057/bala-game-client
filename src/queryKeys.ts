const balanceGame = {
  all: () => ["all", "balance_game"] as const,
  lists: ({ limit }: { limit: number }) =>
    [...balanceGame.all(), { limit }] as const,
  list: (id: number) => [...balanceGame.all(), { id }] as const,
  participantCount: (id: number) =>
    [...balanceGame.all(), "participantCount", { id }] as const,
  statistics: (id: number) =>
    [...balanceGame.all(), "statistics", { id }] as const,
  comments: (id: number) => [...balanceGame.all(), "comments", { id }] as const,
};

export const QUERYKEYS = {
  balanceGame,
};
