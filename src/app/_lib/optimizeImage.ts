export const optimizeImage = async (file: File): Promise<File> => {
  try {
    // 이미지를 Canvas에 그리기 위한 준비
    const image = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // 이미지 로드를 Promise로 래핑
    await new Promise((resolve) => {
      image.onload = resolve;
      image.src = URL.createObjectURL(file);
    });

    // 캔버스 크기 설정 (최대 800x800)
    const maxSize = 800;
    let width = image.width;
    let height = image.height;

    if (width > height && width > maxSize) {
      height = Math.round((height * maxSize) / width);
      width = maxSize;
    } else if (height > maxSize) {
      width = Math.round((width * maxSize) / height);
      height = maxSize;
    }

    canvas.width = width;
    canvas.height = height;

    // 이미지 그리기
    ctx?.drawImage(image, 0, 0, width, height);

    // 압축된 이미지를 Blob으로 변환
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob as Blob),
        "image/jpeg",
        0.8 // 품질 (0-1)
      );
    });

    // File 객체로 변환
    return new File([blob], file.name, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("이미지 최적화 실패:", error);
    return file; // 실패 시 원본 반환
  }
};
