import { useEffect } from "react";

interface UseIntersectionObserverProps {
  ref: React.RefObject<HTMLElement>;
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
}

export const useIntersectionObserver = ({
  ref,
  callback,
  options = {
    threshold: 0.1,
    root: null,
    rootMargin: "0px",
  },
}: UseIntersectionObserverProps) => {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(callback, options);
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);
};
