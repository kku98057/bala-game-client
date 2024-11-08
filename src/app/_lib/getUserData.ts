import Cookies from "js-cookie";
export default async function getUserData() {
  const token = Cookies.get("token");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`,
      {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();

    return data.data;
  } catch (error) {}
}
