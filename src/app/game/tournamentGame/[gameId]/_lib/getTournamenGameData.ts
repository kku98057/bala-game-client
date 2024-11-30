export const getTournamenGameData = async (id: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tournamentGame/${id}`,
      { credentials: "include", cache: "no-cache" }
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};
