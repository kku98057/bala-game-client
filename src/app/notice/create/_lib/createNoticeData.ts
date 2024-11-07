import Cookies from "js-cookie";

export default async function createNoticeData(formData: {
  title: string;
  content: string;
  isVisible: boolean;
}) {
  const token = Cookies.get("token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/notice`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("공지사항 생성에 실패했습니다.");
  }
}
