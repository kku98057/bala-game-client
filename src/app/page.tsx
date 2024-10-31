"use client";

import { useMutation } from "@tanstack/react-query";
import { GameProps } from "./types/gameType";
import { formatRevalidate } from "next/dist/server/lib/revalidate";

interface BalanceGameProps {
  name: string;
  list: { name: string; image: File; id: number }[];
  gameId: number;
}

export default function Home() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", e.currentTarget.image.files[0]);
    await fetch("http://localhost:3001/api/balanceGame/create", {
      method: "POST",
      body: formData,
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="image" />
      <button type="submit">업로드</button>
    </form>
  );
}
