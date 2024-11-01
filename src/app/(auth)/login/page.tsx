"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

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
      router.push("/");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-zinc-800/50 p-8 rounded-2xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">로그인</h2>
          <p className="mt-2 text-zinc-400">계정에 로그인하세요</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="이메일"
              className="w-full p-3 bg-zinc-700/50 rounded-xl text-white placeholder:text-zinc-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="비밀번호"
              className="w-full p-3 bg-zinc-700/50 rounded-xl text-white placeholder:text-zinc-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold
                     transition-colors duration-200"
          >
            로그인
          </button>
        </form>

        <div className="text-center text-zinc-400">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            회원가입하기
          </Link>
        </div>

        {/* 소셜 로그인 버튼들 (나중에 추가) */}
        <div className="space-y-3">
          {/* <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-white font-semibold">
            카카오로 로그인
          </button> */}
        </div>
      </div>
    </div>
  );
}
