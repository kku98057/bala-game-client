"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FiSearch, FiFileText } from "react-icons/fi";

import Link from "next/link";

import Cookies from "js-cookie";

import { UserProps, UserRole } from "@/app/types/UserType";
import { formatDate } from "@/app/utils/formatDate";
import { getNoticeData } from "./_lib/getNoticeData";
import Loading from "../_components/Loading";
import { QUERYKEYS } from "@/queryKeys";

export default function NoticePage() {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // 실제 검색에 사용될 쿼리
  const [page, setPage] = useState(1);
  const [user, setUser] = useState<UserProps | null>(null);
  const {
    data: noticeData,

    isPending,
  } = useQuery({
    queryKey: QUERYKEYS.notice.lists(page, searchQuery),
    queryFn: () => getNoticeData({ page, search: searchQuery, limit: 100 }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search); // 폼 제출 시 검색어를 업데이트
    setPage(1);
  };
  // 페이지네이션 범위 계산 함수
  const getPageRange = (currentPage: number, totalPages: number) => {
    const delta = 2; // 현재 페이지 양쪽에 보여줄 페이지 수
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // 첫 페이지
        i === totalPages || // 마지막 페이지
        (i >= currentPage - delta && i <= currentPage + delta) // 현재 페이지 주변
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, []);
  return (
    <main className="min-h-dvh bg-zinc-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">공지사항</h1>
            {user?.role === UserRole.SUPER_ADMIN && (
              <Link
                href="/notice/create"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                공지사항 작성
              </Link>
            )}
          </div>

          {/* 검색 */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="w-full px-4 py-3 pl-12 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                검색
              </button>
            </div>
          </form>

          {/* 공지사항 목록 */}
          {!isPending ? (
            <div className="space-y-4">
              {noticeData?.notices?.map((notice: any) => (
                <Link
                  key={notice.id}
                  href={`/notice/${notice.id}`}
                  className={`block p-6 border rounded-lg transition-all ${
                    notice.isVisible
                      ? "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                      : "bg-zinc-800/30 border-red-900/50 hover:border-red-900"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-semibold text-white">
                          {notice.title}
                        </h2>
                        {!notice.isVisible && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-900/50 text-red-300 rounded">
                            비공개
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span>{notice.author.nickname}</span>
                        <span>{formatDate(notice.createdAt)}</span>
                      </div>
                    </div>
                    <FiFileText
                      className={`text-2xl ${
                        notice.isVisible ? "text-indigo-400" : "text-red-400"
                      }`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Loading />
          )}

          {/* 검색 결과가 없을 때 메시지 */}
          {noticeData?.notices?.length === 0 && (
            <div className="text-center py-8 text-zinc-400">
              {searchQuery
                ? "검색 결과가 없습니다."
                : "등록된 공지사항이 없습니다."}
            </div>
          )}

          {/* 페이지네이션 수정 */}
          {noticeData?.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-zinc-800 rounded-lg text-white disabled:opacity-50"
              >
                이전
              </button>
              <div className="flex items-center gap-2">
                {getPageRange(page, noticeData.totalPages).map((p, index) =>
                  p === "..." ? (
                    <span
                      key={`dots-${index}`}
                      className="w-8 text-center text-zinc-400"
                    >
                      {p}
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(Number(p))}
                      className={`w-8 h-8 rounded-lg ${
                        page === p
                          ? "bg-indigo-600 text-white"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() =>
                  setPage((p) => Math.min(noticeData.totalPages, p + 1))
                }
                disabled={page === noticeData.totalPages}
                className="px-4 py-2 bg-zinc-800 rounded-lg text-white disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
