import Cookies from "js-cookie";

interface GetNoticeParams {
  page?: number;
  search?: string;
  limit?: number;
}

export const getNoticeData = async ({
  page = 1,
  search = "",
  limit = 5,
}: GetNoticeParams) => {
  const token = Cookies.get("token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/notice?page=${page}&search=${search}&limit=${limit}`,
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }), // 토큰이 있을 때만 헤더 추가
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notices");
  }
  const data = await response.json();
  return data.data;
};
