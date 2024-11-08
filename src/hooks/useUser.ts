import getUserData from "@/app/_lib/getUserData";
import { useAuthStore } from "@/app/store";
import { QUERYKEYS } from "@/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function useUser() {
  const { data, isError } = useQuery({
    queryKey: QUERYKEYS.user(),
    queryFn: getUserData,
    enabled: !!Cookies.get("token"),
  });
  const setUser = useAuthStore((state) => state.setUser);
  useEffect(() => {
    if (data) setUser(data);
    if (isError) {
      setUser(null);
      Cookies.remove("token");
    }
  }, [data, isError]);
}
