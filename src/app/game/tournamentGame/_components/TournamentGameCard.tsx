import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TournamentList } from "@/app/types/gameType";

interface TournamentGameCardProps {
  game: TournamentList;
  delay: number;
}

export default function TournamentGameCard({
  game,
  delay,
}: TournamentGameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={`/game/tournamentGame/${game.id}`}
        className="group block bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:bg-gray-50"
      >
        <div className="relative w-full h-64">
          <Image
            src={game.items[0].imageUrl}
            alt={game.items[0].name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-medium mb-3 truncate">
            <span className="text-blue-500 font-bold">
              [{game.itemsCount as number}강전]
            </span>
            {game.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span className="font-medium">{game.username}</span>
            <time className="text-gray-400">
              {new Date(game.createdAt).toLocaleDateString()}
            </time>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>{game.participantCount.toLocaleString()}명 참여</span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={game.items[0].imageUrl}
                alt={game.items[0].name}
                fill
                className="object-cover"
                sizes="100%"
              />
            </div>
            <span className="font-bold text-gray-400">VS</span>
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={game.items[1].imageUrl}
                alt={game.items[1].name}
                fill
                className="object-cover"
                sizes="100%"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
