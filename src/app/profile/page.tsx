"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import Section from "@/app/_components/Section";
import ProfileInfo from "./_lib/_components/ProfileInfo";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import ProfileGameList from "./_lib/_components/ProfileGame";
import { getUserProfileData } from "./_lib/getUserProfileData";
import Loading from "../_components/Loading";

export default function ProfileSection() {
  return (
    <Section>
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileInfo />
        <ProfileGameList />
      </div>
    </Section>
  );
}
