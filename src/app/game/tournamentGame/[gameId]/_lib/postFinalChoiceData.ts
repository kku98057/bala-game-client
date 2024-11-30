interface DataProps {
  tournamentId: number;
  selectedItemId: number;
}

export const postFinalChoiceData = async (finalChoiceData: DataProps) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tournamentGame/final-choice`,
      {
        cache: "no-cache",
        credentials: "include",
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
