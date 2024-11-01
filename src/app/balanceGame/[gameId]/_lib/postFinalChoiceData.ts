interface DataProps {
  balanceGameId: number;
  selectedItemId: number;
}

export const postFinalChoiceData = async (finalChoiceData: DataProps) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/balanceGame/final-choice`,
      {
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json", // 이 헤더를 추가
        },
        method: "POST",
        body: JSON.stringify(finalChoiceData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to increment participant count");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};
