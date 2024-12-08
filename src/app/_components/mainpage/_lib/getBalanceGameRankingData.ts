export const getBalanceGameRankingData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ranking/balanceGame`,
      {
        cache: "no-cache",
        credentials: "include",
      }
    );
    const data = await response.json();
    return data.payload;
  } catch (error) {
    throw error;
  }
};
