const tournamentGame = {
  all: () => ["all", "balance_game"] as const,
  lists: ({ limit }: { limit: number }) =>
    [...tournamentGame.all(), { limit }] as const,
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

export const QUERYKEYS = {
  tournamentGame,
};
