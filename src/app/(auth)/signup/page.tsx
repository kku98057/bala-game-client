"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    nickname: "",
    general: "",
  });

  // 닉네임 유효성 검사 함수
  const validateNickname = (nickname: string) => {
    // 한글, 영문, 숫자만 허용하는 정규식

    if (nickname.length < 2) {
      return "닉네임은 2자 이상이어야 합니다.";
    }
    if (nickname.length > 8) {
      return "닉네임은 8자 이하여야 합니다.";
    }
    if (!/^[가-힣a-zA-Z0-9]*$/.test(nickname)) {
      return "한글, 영문, 숫자만 사용 가능합니다.";
    }
    return "";
  };
  // 완성되지 않은 한글 체크 함수

  const hasIncompleteHangul = (str: string) => {
    // 자음/모음만 있는 불완전한 한글 체크를 위한 정규식
    const incompleteHangulRegex = /[\u1100-\u11FF\u3130-\u318F]/;
    return incompleteHangulRegex.test(str);
  };
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 입력값이 8자를 초과하면 8자까지만 잘라내기
    const truncatedValue = value.slice(0, 8);

    // 유효성 검사 실행
    const error = validateNickname(truncatedValue);

    setFormData((prev) => ({ ...prev, nickname: truncatedValue }));
    setErrors((prev) => ({ ...prev, nickname: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 닉네임의 불완전한 한글 체크
    if (hasIncompleteHangul(formData.nickname)) {
      setErrors((prev) => ({
        ...prev,
        nickname: "완성되지 않은 한글이 있습니다. 올바른 한글로 입력해주세요.",
      }));
      return;
    }
    // 폼 제출 전 최종 유효성 검사
    const nicknameError = validateNickname(formData.nickname);
    if (nicknameError) {
      setErrors({ ...errors, nickname: nicknameError });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "회원가입에 실패했습니다.");
      }

      router.push("/login");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "회원가입에 실패했습니다.";
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-zinc-800/50 p-8 rounded-2xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">회원가입</h2>
          <p className="mt-2 text-zinc-400">새로운 계정을 만들어보세요</p>
        </div>

        {errors.general && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
            {errors.general}
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

          <div>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.nickname}
                onChange={handleNicknameChange}
                placeholder="닉네임 (한글, 영문, 숫자만 가능)"
                maxLength={8}
                className="w-full p-3 bg-zinc-700/50 rounded-xl text-white placeholder:text-zinc-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                {formData.nickname.length}/8
              </span>
            </div>
            {errors.nickname && (
              <p className="mt-1 text-red-400 text-sm">{errors.nickname}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold
                     transition-colors duration-200"
          >
            가입하기
          </button>
        </form>

        <div className="text-center text-zinc-400">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
}
