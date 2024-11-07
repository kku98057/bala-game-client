export default async function postRegisterData(formData: FormData) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "회원가입에 실패했습니다.");
  }
}
