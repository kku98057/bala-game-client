export const createBalanceGame = async (formData: FormData) => {
  const response = await fetch("http://localhost:3001/api/balanceGame/create", {
    method: "POST",
    body: formData,
  });
  console.log(response);
  if (!response.ok) {
    throw new Error("게임 생성에 실패했습니다");
  }

  return response.json();
};
