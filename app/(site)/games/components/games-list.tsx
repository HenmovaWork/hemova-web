"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Game } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter } from "lucide-react";

interface GamesListProps {
  games: Game[];
}

export default function GamesList({ games }: GamesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  // Extract unique genres from all games
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    games.forEach((game) => {
      if (game.genres) {
        game.genres.split(",").forEach((genre) => {
          genreSet.add(genre.trim());
        });
      }
    });
    return Array.from(genreSet).sort();
  }, [games]);

  // Filter games based on search term and selected genre
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch =
        searchTerm === "" ||
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.tagline.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre =
        selectedGenre === "" ||
        game.genres.toLowerCase().includes(selectedGenre.toLowerCase());

      return matchesSearch && matchesGenre;
    });
  }, [games, searchTerm, selectedGenre]);

  if (!games || games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No games available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Genres</option>
            {allGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredGames.length} of {games.length} games
      </div>

      {/* Games Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filteredGames.map((game) => (
          <Link key={game.slug} href={`/games/${game.slug}`}>
            <Card className="overflow-hidden group relative cursor-pointer">
              <Image
                className="transition-all ease-in-out duration-300 group-hover:scale-110"
                src={game.coverImage.src}
                height={900}
                width={1600}
                alt={game.title}
                quality={85}
                loading="lazy"
              />
              <CardContent className="p-4 top-[118%] transition-all ease-in-out duration-500 group-hover:top-1/2 absolute text-center h-fit bg-black/70 left-0 right-0 -translate-y-1/2">
                <div className="text-lg font-semibold text-primary">
                  {game.title}
                </div>
                <div className="text-sm text-white/80">{game.tagline}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* No results message */}
      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No games match your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedGenre("");
            }}
            className="mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
