export default async function getTournamenGameListData({
  page,
  limit,
  sort,
}: {
  page: string | unknown;
  limit: string | unknown;
  sort: "latest" | "popular" | "comments";
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tournamentGame?page=${page}&limit=${limit}&sort=${sort}`,
      {
        cache: "no-cache",
        credentials: "include",
      }
    );
    const data = await res.json();

    return data.payload;
  } catch (error) {
    console.error(error);
    return error;
  }
}
