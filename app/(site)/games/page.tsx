import { ContentService } from "@/lib/content";
import { Game } from "@/lib/types";
import GamesList from "./components/games-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games - Henmova",
  description: "Explore our collection of games and interactive experiences.",
};

export default async function GamesPage() {
  let games: Game[] = [];

  try {
    const result = await ContentService.games.getAll();
    games = result.items;
  } catch (error) {
    console.error("Failed to fetch games:", error);
    games = [];
  }

  return (
    <div className="container mx-auto p-4 md:px-8">
      <div className="text-2xl font-semibold pb-4">Games</div>
      <GamesList games={games} />
    </div>
  );
}
