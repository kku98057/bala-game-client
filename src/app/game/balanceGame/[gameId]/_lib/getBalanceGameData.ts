export const getBalanceGameData = async (id: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/balanceGame/${id}`,
      {
        cache: "no-cache",
        credentials: "include",
      }
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};
