import { optimizeImage } from "@/app/_lib/optimizeImage";
import Cookies from "js-cookie";
export const createTournamentGameData = async (formData: FormData) => {
  const imageFiles = formData.getAll("image") as File[];
  const compressedFormData = new FormData();
  const token = Cookies.get("token");
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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tournamentGame/create`,
    {
      method: "POST",
      body: compressedFormData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw {
      response: {
        status: response.status,
        data: errorData,
      },
    };
  }

  return response.json();
};
