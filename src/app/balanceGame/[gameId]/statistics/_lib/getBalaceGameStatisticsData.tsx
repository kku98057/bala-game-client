export const getBalaceGameStatisticsData = async (id: number) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/balanceGame/statistics/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch statistics");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};
