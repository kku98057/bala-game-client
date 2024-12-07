import Cookies from "js-cookie";
export const getUserProfileData = async () => {
  const token = Cookies.get("token");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
      {
        cache: "no-cache",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data.payload;
  } catch (error) {
    throw error;
  }
};
