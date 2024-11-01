import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import { motion } from "framer-motion";
import { FiMessageSquare, FiSend } from "react-icons/fi";
interface Comment {
  id: number;
  nickname: string;
  content: string;
  createdAt: string;
}

interface CommentsProps {
  gameId: number;
}

export default function Comments({ gameId }: CommentsProps) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  // 댓글 목록 조회
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: QUERYKEYS.balanceGame.comments(gameId),
    queryFn: async () => {
      const response = await fetch(`/api/balanceGame/${gameId}/comments`);
      if (!response.ok) throw new Error("댓글 조회 실패");
      return response.json();
    },
  });

  // 댓글 작성
  const { mutate: addComment, isPending } = useMutation({
    mutationFn: async ({
      nickname,
      content,
    }: {
      nickname: string;
      content: string;
    }) => {
      const response = await fetch(`/api/balanceGame/${gameId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname, content }),
      });
      if (!response.ok) throw new Error("댓글 작성 실패");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERYKEYS.balanceGame.comments(gameId),
      });
      setContent("");
      setNickname("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;
    addComment({ nickname, content });
  };
  return (
    <div className="mt-8 bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <FiMessageSquare className="text-2xl text-indigo-400" />
        <h3 className="text-xl font-bold text-white">
          댓글 {comments?.length ?? 0}개
        </h3>
      </div>

      {/* 댓글 작성 폼 */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="mb-8 space-y-4"
      >
        <div className="relative">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 (최대 8자)"
            maxLength={8}
            className="w-full bg-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-400 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
            {nickname.length}/8
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="재미있는 댓글을 남겨보세요!"
            maxLength={100}
            className="w-full bg-zinc-700/50 rounded-xl pl-4 pr-24 py-3 text-white placeholder-zinc-400 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <span className="text-zinc-400 text-sm">{content.length}/100</span>
            <button
              type="submit"
              disabled={isPending || !nickname.trim() || !content.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-600 
                       rounded-lg text-white transition-colors"
            >
              <FiSend
                className={`text-lg ${isPending ? "animate-pulse" : ""}`}
              />
            </button>
          </div>
        </div>
      </motion.form>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-zinc-400">댓글을 불러오는 중...</div>
        ) : comments?.length === 0 ? (
          <div className="text-center text-zinc-400">
            첫 번째 댓글을 작성해보세요!
          </div>
        ) : (
          comments?.map((comment, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={comment.id}
              className="group bg-zinc-700/30 hover:bg-zinc-700/50 rounded-xl p-4 
                       transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">
                  {comment.nickname}
                </span>
                <span className="text-sm text-zinc-400">
                  {new Date(comment.createdAt).toLocaleDateString("ko-KR", {
                    year: "2-digit",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-zinc-200 break-all">{comment.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
