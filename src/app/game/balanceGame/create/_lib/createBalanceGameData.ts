import { BalanceGameProps } from "@/app/types/balanceGameType";
import Cookies from "js-cookie";
export const createBalanceGameData = async (gameData: BalanceGameProps) => {
  const token = Cookies.get("token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/balanceGame/create`,
    {
      method: "POST",
      body: JSON.stringify(gameData),
      headers: {
        cache: "no-cache",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw {
      response: {
        status: response.status,
        data: errorData,
      },
    };
  }

  return response.json();
};
