import Cookies from "js-cookie";

export const getNoticeDetail = async (id: number) => {
  const token = Cookies.get("token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/notice/${id}`,
    {
      next: { revalidate: 0 },
      credentials: "include",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notice detail");
  }

  const data = await response.json();
  return data.data;
};
