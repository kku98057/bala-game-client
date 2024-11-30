"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createNoticeData from "./_lib/createNoticeData";
import { QUERYKEYS } from "@/queryKeys";

export default function CreateNoticePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isVisible: true,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      isVisible: boolean;
    }) => createNoticeData(data),
    mutationKey: ["createNotice"],
  });
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    mutate(formData, {
      onSuccess: () => {
        router.push("/notice");
        router.refresh();

        queryClient.invalidateQueries({ queryKey: QUERYKEYS.notice.all() });
      },
      onError(error, variables, context) {
        console.error("공지사항 생성 실패:", error);
        alert("공지사항 생성에 실패했습니다.");
      },
    });
  };

  return (
    <main className="min-h-dvh bg-zinc-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <Link
              href="/notice"
              className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-4"
            >
              <FiArrowLeft className="mr-2" />
              돌아가기
            </Link>
            <h1 className="text-3xl font-bold text-white">공지사항 작성</h1>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 입력 */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                제목
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                maxLength={30}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>

            {/* 내용 입력 */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                내용
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                required
                rows={15}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="공지사항 내용을 입력하세요"
              />
            </div>

            {/* 공개 여부 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVisible"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isVisible: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-indigo-600 bg-zinc-800 border-zinc-700 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="isVisible"
                className="ml-2 text-sm font-medium text-zinc-300"
              >
                즉시 공개
              </label>
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end gap-4">
              <Link
                href="/notice"
                className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "작성 중..." : "작성하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
