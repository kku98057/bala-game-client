type Props = {
  questionId: number;
  itemId: number;
};
export default async function postRecordBalanceChoice({
  questionId,
  itemId,
}: Props) {
  try {
    const response = await fetch("/api/balanceGame/choice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId,
        selectedItemId: itemId,
      }),
    });

    if (!response.ok) throw new Error("선택 저장에 실패했습니다.");
  } catch (error) {
    console.error("선택 저장 실패:", error);
  }
}
