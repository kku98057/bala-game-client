import Cookies from "js-cookie";

export async function deleteBalaceGameData(id: number) {
  const token = Cookies.get("token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/balanceGame/${id}`,
    {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("게임 삭제에 실패했습니다.");
  }

  return response.json();
}
