"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getUserProfileData } from "../getUserProfileData";
import Loading from "@/app/_components/Loading";
import { useEffect } from "react";

export default function ProfileInfo() {
  const router = useRouter();
  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfileData(),
  });

  useEffect(() => {
    if (isError) {
      router.push("/login");
    }
  }, [isError, router]);

  if (isLoading) {
    return null;
  }

  if (isError) {
    return null;
  }

  return (
    <div className="bg-zinc-800/30 rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
        {/* 프로필 이미지 */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
          {profileData.profileImageUrl ? (
            <Image
              src={profileData.profileImageUrl}
              alt={profileData.nickname}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-zinc-700 flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-zinc-400">
                {profileData.nickname.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* 유저 정보 */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
            {profileData.nickname}
          </h1>
          <div className="space-y-1 text-zinc-400 text-sm md:text-base">
            <p>{profileData.email}</p>
            <p>
              가입일: {new Date(profileData.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* 통계 */}
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2 md:gap-4">
            {/* <div className="bg-zinc-700/50 rounded-lg px-3 py-2 md:px-4 md:py-2">
              <p className="text-xs md:text-sm text-zinc-400">포인트</p>
              <p className="text-base md:text-lg font-bold text-indigo-400">
                {profileData.stats.totalPoints.toLocaleString()}
              </p>
            </div> */}
            <div className="bg-zinc-700/50 rounded-lg px-3 py-2 md:px-4 md:py-2">
              <p className="text-xs md:text-sm text-zinc-400">생성한 게임</p>
              <p className="text-base md:text-lg font-bold text-indigo-400">
                {profileData.stats.totalGames}
              </p>
            </div>
            <div className="bg-zinc-700/50 rounded-lg px-3 py-2 md:px-4 md:py-2">
              <p className="text-xs md:text-sm text-zinc-400">작성한 댓글</p>
              <p className="text-base md:text-lg font-bold text-indigo-400">
                {profileData.stats.totalComments}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
