import { optimizeImage } from "@/app/_lib/optimizeImage";

export const createBalanceGame = async (formData: FormData) => {
  const imageFiles = formData.getAll("image") as File[];
  const compressedFormData = new FormData();

  // 이미지가 아닌 데이터 복사
  for (const [key, value] of formData.entries()) {
    if (key !== "image") {
      compressedFormData.append(key, value);
    }
  }

  // 이미지 최적화 및 추가
  for (const file of imageFiles) {
    if (file.type.startsWith("image/")) {
      const optimizedFile = await optimizeImage(file);
      compressedFormData.append("image", optimizedFile);
    } else {
      compressedFormData.append("image", file);
    }
  }

  const response = await fetch("http://localhost:3001/api/balanceGame/create", {
    method: "POST",
    body: compressedFormData,
  });
  if (!response.ok) {
    throw new Error("게임 생성에 실패했습니다");
  }

  return response.json();
};
