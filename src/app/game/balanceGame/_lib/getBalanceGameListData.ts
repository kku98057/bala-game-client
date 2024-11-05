type Props = {
  page: string | unknown;
  limit: string | unknown;
};
export default async function getBalanceGameListData({ page, limit }: Props) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/balanceGame?page=${page}&limit=${limit}`
    );
    const data = await res.json();

    return data.payload;
  } catch (error) {
    console.error(error);
    return error;
  }
}
