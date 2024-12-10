const RankBadge = ({ rank }: { rank: number }) => {
  // SVG 크라운 아이콘들
  const crowns = {
    1: (
      <svg
        className="w-6 h-6 text-yellow-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M2.5 7.5L5 16.5H19L21.5 7.5L16.5 10.5L12 4.5L7.5 10.5L2.5 7.5Z" />
        <path d="M5 16.5V18.5H19V16.5H5Z" />
      </svg>
    ),
    2: (
      <svg
        className="w-6 h-6 text-zinc-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3 7.5L5.5 16.5H18.5L21 7.5L16.5 10.5L12 4.5L7.5 10.5L3 7.5Z" />
        <path d="M5.5 16.5V18.5H18.5V16.5H5.5Z" />
      </svg>
    ),
    3: (
      <svg
        className="w-6 h-6 text-amber-600"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3.5 7.5L6 16.5H18L20.5 7.5L16.5 10.5L12 4.5L7.5 10.5L3.5 7.5Z" />
        <path d="M6 16.5V18.5H18V16.5H6Z" />
      </svg>
    ),
  };

  return (
    <div className="relative flex items-center justify-center w-8">
      {rank <= 3 ? (
        crowns[rank as keyof typeof crowns]
      ) : (
        <span className="font-bold text-zinc-500">{rank}</span>
      )}
    </div>
  );
};
