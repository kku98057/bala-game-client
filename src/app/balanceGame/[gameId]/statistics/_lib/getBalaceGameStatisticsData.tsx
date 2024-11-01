export const getBalaceGameStatisticsData = async (id: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/balanceGame/statistics/${id}`,
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
