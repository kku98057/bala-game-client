export default async function balanceGameListData({
  page,
  limit,
}: {
  page: string | unknown;
  limit: string | unknown;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/balanceGame?page=${page}&limit=${limit}`
    );
    const data = await res.json();
    console.log("API Response:", data);
    console.log("Payload structure:", data.payload);

    return data.payload;
  } catch (error) {
    console.error(error);
    return error;
  }
}
