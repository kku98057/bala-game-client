"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit2, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

import { UserRole } from "../../types/UserType";
import { formatDate } from "@/app/utils/formatDate";
import { getNoticeDetail } from "./_lib/getNoticeDetailData";
import { deleteNotice } from "./_lib/deleteNotice";
import { QUERYKEYS } from "@/queryKeys";
import { useAuthStore } from "@/app/store";

export default function NoticeDetailPage({
  params,
}: {
  params: { noticeId: string };
}) {
  const router = useRouter();
  const { user } = useAuthStore((state) => state);

  const { data: notice, isLoading } = useQuery({
    queryKey: QUERYKEYS.notice.detail(Number(params.noticeId)),
    queryFn: () => getNoticeDetail(Number(params.noticeId)),
  });

  const { mutate } = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteNotice(id),
    mutationKey: ["notice", "delete", { id: `${params.noticeId}` }],
  });
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    if (!confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      return;
    }
    mutate(
      { id: Number(params.noticeId) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: QUERYKEYS.notice.all() });
          router.push("/notice");
        },
        onError(error, variables, context) {
          console.error("공지사항 삭제 실패:", error);
          alert("공지사항 삭제에 실패했습니다.");
        },
      }
    );
    // try {
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/notice/${params.noticeId}`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error("Failed to delete notice");
    //   }

    //   router.push("/notice");
    //   router.refresh();
    // } catch (error) {
    //   console.error("공지사항 삭제 실패:", error);
    //   alert("공지사항 삭제에 실패했습니다.");
    // }
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-zinc-900 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-dvh bg-zinc-900 flex items-center justify-center">
        <div className="text-white">공지사항을 찾을 수 없습니다.</div>
      </div>
    );
  }

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
              목록으로
            </Link>

            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-white">{notice.title}</h1>
              {user?.role === UserRole.SUPER_ADMIN && (
                <div className="flex gap-2">
                  <Link
                    href={`/notice/${params.noticeId}/edit`}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm text-zinc-400">
              <span>{notice.author.nickname}</span>
              <span>{formatDate(notice.createdAt)}</span>
            </div>
          </div>

          {/* 내용 */}
          <div className="prose prose-invert max-w-none">
            <div className="bg-zinc-800/50 rounded-lg p-6 min-h-[400px] whitespace-pre-wrap text-white">
              {notice.content}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/notice"
              className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              목록으로
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
