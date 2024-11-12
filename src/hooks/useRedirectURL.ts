import { useSearchParams } from "next/navigation";

export default function useRedirectURL() {
  const searchParams = useSearchParams();
  function returnURL(prarm: string) {
    const url = searchParams.get(prarm);
    const returnUrl = url ? encodeURIComponent(url) : null;

    return returnUrl ? `?${prarm}=${returnUrl}` : "";
  }
  return { returnURL };
}
