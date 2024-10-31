const balanceGame = {
  all: () => ["all", "balance_game"] as const,
  list: (id: number) => [...balanceGame.all(), id] as const,
};

export const QUERYKEYS = {
  balanceGame,
};
