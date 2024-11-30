import { GameTypeProps } from "@/app/types/types";

export default async function getGameCommentData({
  gameId,
  currentPage,
  gameType,
}: {
  gameId: number;
  currentPage: number;
  gameType: GameTypeProps;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${gameId}/${gameType}?page=${currentPage}&limit=10`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch comments");
  const data = await response.json();
  return data.data;
}
