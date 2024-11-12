"use client";

import { useState } from "react";
import Link from "next/link";
import postLogin from "../_lib/postLogin";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store";
import useRedirectURL from "@/hooks/useRedirectURL";

export default function LoginPage() {
  const { setUser } = useAuthStore((state) => state);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: { email: string; password: string }) =>
      postLogin(data, setError),
    onSuccess: (res) => {
      setUser(res.data.user);
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get("returnUrl");
      window.location.href = returnUrl || "/";
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };
  const { returnURL } = useRedirectURL();
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
            href={`/signup${returnURL("returnUrl")}`}
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
