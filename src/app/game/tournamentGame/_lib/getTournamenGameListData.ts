export default async function getTournamenGameListData({
  page,
  limit,
}: {
  page: string | unknown;
  limit: string | unknown;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tournamentGame?page=${page}&limit=${limit}`
    );
    const data = await res.json();

    return data.payload;
  } catch (error) {
    console.error(error);
    return error;
  }
}
