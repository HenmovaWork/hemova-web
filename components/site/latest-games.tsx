"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LatestGamesProps {
  games: Game[];
}

export default function LatestGames({ games }: LatestGamesProps) {
  const [bgImg, setBgImg] = useState<string>(
    games.length > 0 ? games[0].coverImage.src : ""
  );

  if (!games || games.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-6 relative overflow-hidden">
      <div
        className={`absolute inset-0 scale-125 blur-3xl transition-all ease-in-out duration-500`}
        style={{
          backgroundImage: `radial-gradient(circle,rgba(0,0,0,.15),rgba(0,0,0,.85)),url("${bgImg}")`,
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundBlendMode: "darken",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="container mx-auto p-4 md:px-8 text-white relative z-10">
        <h1 className="sm:text-4xl text-2xl font-bold mb-8 text-center">
          Latest Games
        </h1>
        <div className="flex flex-wrap justify-center items-start gap-6">
          {games.slice(0, 3).map((game, index) => (
            <Card
              key={game.slug}
              className="bg-white/10 backdrop-blur-xs border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer w-80 h-[22rem] in-out duration-150"
              onMouseEnter={() => setBgImg(game.coverImage.src)}
            >
              <CardHeader className="p-3">
                <CardTitle className="text-center">
                  <Link href={`/games/${game.slug}`}>
                    <Image
                      draggable={false}
                      src={game.coverImage.src || "/placeholder.svg"}
                      alt={game.coverImage.alt || game.title}
                      width={game.coverImage.width || 300}
                      height={game.coverImage.height || 400}
                      className="rounded-md w-full h-48 object-cover mx-auto"
                      quality={85}
                      loading="lazy"
                    />
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-center">
                <Link href={`/games/${game.slug}`}>
                  <h3 className="text-lg font-bold mb-1">{game.title}</h3>
                  <p className="text-sm text-white/80 mb-2">{game.tagline}</p>
                  <div className="text-xs text-white/60">
                    <p className="mb-1">
                      <span className="font-semibold">Genres:</span>{" "}
                      {game.genres}
                    </p>
                    <p>
                      <span className="font-semibold">Platforms:</span>{" "}
                      {game.platforms}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
