import Cookies from "js-cookie";

interface GameDataProps {
  gameType: "BALANCE" | "TOURNAMENT";
  limit: number;
  page: number;
}
export const getUserGameData = async ({
  gameType,
  limit,
  page,
}: GameDataProps) => {
  const token = Cookies.get("token");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/games?type=${gameType}&page=${page}&limit=${limit}`,

      {
        cache: "no-cache",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data.payload;
  } catch (error) {
    throw error;
  }
};
