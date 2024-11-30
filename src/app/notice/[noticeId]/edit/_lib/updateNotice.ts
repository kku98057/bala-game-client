import Cookies from "js-cookie";

interface UpdateNoticeData {
  id: number;
  title: string;
  content: string;
  isVisible: boolean;
}

export const updateNotice = async (data: UpdateNoticeData) => {
  const token = Cookies.get("token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/notice/${data.id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update notice");
  }

  return response.json();
};
