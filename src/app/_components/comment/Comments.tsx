"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import Cookies from "js-cookie";
import { UserProps } from "@/app/types/UserType";
import { useRouter } from "next/navigation";
import getGameCommentData from "./_lib/getGameCommentData";
import { useAuthStore } from "@/app/store";

interface CommentListType {
  comments: CommentType[];

  currentPage: number;
  totalPages: number;
  totalComments: number;
}

interface CommentProps {
  gameId: number;
  gameType: "BALANCE" | "TOURNAMENT";
}

interface CommentType {
  id: number;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    nickname: string;
  };
}
export default function Comments({ gameId, gameType }: CommentProps) {
  const [content, setContent] = useState("");
  const { user } = useAuthStore((state) => state);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  // 로그인한 유저 정보 가져오기

  // 댓글 목록 조회
  const { data: comments } = useQuery<CommentListType>({
    queryKey: QUERYKEYS.tournamentGame.comments.list(gameId, currentPage),
    queryFn: () => getGameCommentData({ gameId, currentPage, gameType }),
  });

  // 댓글 작성
  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            gameId,
            gameType,
            content,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERYKEYS.tournamentGame.comments.all(),
      });
      setContent("");
    },
    onError: (error: Error) => {
      if (error.message.includes("401")) {
        alert("로그인이 필요한 서비스입니다.");
        router.push("/login");
      } else {
        alert(error.message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    createMutation.mutate(content);
  };
  const deleteMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
        {
          cache: "no-cache",
          credentials: "include",
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERYKEYS.tournamentGame.comments.all(),
      });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // 댓글 수정
  const updateMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
        {
          cache: "no-cache",
          credentials: "include",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERYKEYS.tournamentGame.comments.all(),
      });
      setEditingId(null);
      setEditContent("");
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // 댓글 삭제 핸들러
  const handleDelete = (commentId: number) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteMutation.mutate(commentId);
    }
  };

  // 댓글 수정 시작
  const handleEditStart = (comment: CommentType) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  // 댓글 수정 제출
  const handleEditSubmit = (commentId: number) => {
    if (!editContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    updateMutation.mutate({ commentId, content: editContent });
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">
        댓글 {comments?.totalComments.toLocaleString()}개
      </h2>

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => {
              // 최대 글자 수 제한
              if (e.target.value.length <= 300) {
                setContent(e.target.value);
              }
            }}
            placeholder={
              user
                ? "댓글을 입력하세요."
                : "로그인 후 댓글을 작성할 수 있습니다."
            }
            disabled={!user}
            className="w-full h-24 p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
          />{" "}
          {user && (
            <>
              <div className="absolute bottom-2 right-3 text-sm text-zinc-500">
                {content.length}/300
              </div>
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="px-4 py-2 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                {createMutation.isLoading ? "작성 중..." : "댓글 작성"}
              </button>
            </>
          )}
        </div>
      </form>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments?.totalComments === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            첫 번째 댓글을 작성해보세요!
          </div>
        ) : (
          comments?.comments.map((comment) => (
            <div
              key={comment.id}
              className="p-6 bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl space-y-3 hover:bg-zinc-800/70 transition-colors duration-200"
            >
              {/* 댓글 헤더 */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {/* 프로필 이미지 (옵션) */}
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {comment.user.nickname[0]}
                    </span>
                  </div>
                  <div className="flex flex-col  ">
                    {/* 닉네임 */}
                    <span className="font-medium text-white ">
                      {comment.user.nickname}
                    </span>
                    {/* 작성 시간 */}
                    <span className="text-sm text-zinc-400">
                      {new Date(comment.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {user?.id === comment.userId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStart(comment)}
                      className="text-sm text-zinc-400 hover:text-indigo-400"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-sm text-zinc-400 hover:text-red-400"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {/* 댓글 내용 */}
              <div className="pl-11">
                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => {
                        if (e.target.value.length <= 300) {
                          setEditContent(e.target.value);
                        }
                      }}
                      className="w-full h-24 p-4 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSubmit(comment.id)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-3 py-1 bg-zinc-600 text-white rounded-lg"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-300 leading-relaxed break-words">
                    {comment.content}
                  </p>
                )}
              </div>

              {/* 댓글 푸터 - 좋아요, 답글 등의 기능을 추가할 수 있습니다 */}
              {/* <div className="pl-11 flex items-center space-x-4">
                <button className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors duration-200">
                  좋아요
                </button>
                <button className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors duration-200">
                  답글
                </button>
              </div> */}
            </div>
          ))
        )}
        {comments?.totalPages && comments?.totalPages > 1 ? (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-zinc-800 rounded-lg text-white disabled:opacity-50"
            >
              이전
            </button>
            <div className="flex items-center gap-2">
              {Array.from(
                { length: comments?.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, comments?.totalPages)
                )
              }
              disabled={currentPage === comments?.totalPages}
              className="px-4 py-2 bg-zinc-800 rounded-lg text-white disabled:opacity-50"
            >
              다음
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
