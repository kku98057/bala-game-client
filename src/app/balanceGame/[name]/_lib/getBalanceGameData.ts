export const getBalanceGameData = async (id: number) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/balanceGame/${id}`,
      {
        cache: "no-cache",
      }
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};
