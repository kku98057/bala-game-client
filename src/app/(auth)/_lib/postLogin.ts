import Cookies from "js-cookie";
export default async function postLogin(
  formData: { email: string; password: string },
  setError?: (error: string) => void
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "로그인에 실패했습니다.");
    }
    const data = await response.json();
    // 토큰과 유저 정보를 쿠키에 저장
    Cookies.set("token", data.data.token, {
      secure: true,
      sameSite: "strict",
      expires: 7, // 7일
    });

    Cookies.set("user", JSON.stringify(data.data.user), {
      secure: true,
      sameSite: "strict",
      expires: 7,
    });

    // 로그인 성공 시 홈페이지로 이동
    window.location.href = "/";
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "로그인에 실패했습니다.";
    if (setError) setError(errorMessage);
  }
}
