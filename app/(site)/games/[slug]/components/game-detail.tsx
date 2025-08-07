"use client";

import { Game } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CpuIcon, GamepadIcon, PaletteIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MarkdocRenderer from "@/components/markdoc-renderer";
import Title from "@/components/site/title";

interface GameDetailProps {
  game: Game;
}

type PlatformIconProps = {
  platform: string;
} & Partial<React.ComponentPropsWithoutRef<"img">>;

function PlatformIcon(props: PlatformIconProps) {
  const platformMap: Record<string, string> = {
    steam: "/get-it-from/steam.svg",
    epic: "/get-it-from/epic-games.svg",
    appstore: "/get-it-from/app-store.svg",
    googleplay: "/get-it-from/google-play.svg",
  };

  const iconSrc = platformMap[props.platform.toLowerCase()];

  if (!iconSrc) {
    return null;
  }

  return (
    <Image
      draggable={false}
     
      className={props.className}
      src={iconSrc}
      alt={props.alt as string}
      width={props.width as number}
      height={props.height as number}
      quality={85}
      loading="lazy"
    />
  );
}

function PlatformButton({ platform, url }: { platform: string; url: string }) {
  const platformNames: Record<string, string> = {
    steam: "Steam",
    epic: "Epic Games",
    appstore: "App Store",
    googleplay: "Google Play",
  };

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-16 h-16 transition-transform hover:scale-110"
    >
      <PlatformIcon
        platform={platform}
        alt={platformNames[platform] || platform}
        width={48}
        height={48}
        className="w-12 h-12"
      />
    </Link>
  );
}

export default function GameDetail({ game }: GameDetailProps) {
  return (
    <div className="bg-white">
      <div className="container mx-auto p-4 md:px-8">
        {/* Game Title and Tagline */}
        <Title className="font-bold mt-4 mb-2">{game.title}</Title>
        <div className="font-semibold text-center text-xl sm:text-2xl text-primary mt-2 mb-6">
          {game.tagline}
        </div>

        <hr className="my-4" />

        {/* Main Content Grid */}
        <div className="container mx-auto">
          <div className="max-md:flex-col flex justify-around max-w-4xl mx-auto">
            {/* Cover Image */}
            <div className="col-span-2">
              <Image
                draggable={false}
                src={game.coverImage.src}
                alt={game.coverImage.alt || game.title}
                width={500}
                height={700}
                className=" rounded-lg"
                priority
                quality={90}
              />
            </div>

            {/* Game Info Sidebar */}
            <div className="flex flex-col justify-center gap-8">
              <div className="text-2xl font-extrabold uppercase text-center">
                About the Game
              </div>
              <div className="grid grid-cols-1 place-content-center gap-2">
                {[
                  {
                    name: "GENRE",
                    values: game.genres,
                    icon: GamepadIcon,
                  },
                  {
                    name: "ART STYLE",
                    values: game.artStyles,
                    icon: PaletteIcon,
                  },
                  {
                    name: "PLATFORMS",
                    values: game.platforms,
                    icon: CpuIcon,
                  },
                ].map((item, idx) => (
                  <Card key={idx}>
                    <CardHeader className="p-3">
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <item.icon size={32} /> {item.name}
                      </CardTitle>
                      <div className="text-md font-normal text-black/70">
                        {item.values}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8" />

        {/* Game Description */}
        {game.content && (
          <>
            <div className="bg-[#efefef] mb-4 rounded-md">
              <article className="w-full sm:w-[70%] p-4 mx-auto">
                <MarkdocRenderer content={game.content} />
              </article>
            </div>
            <hr className="my-8" />
          </>
        )}

        {/* Download Links */}
        {game.downloadLinks && game.downloadLinks.length > 0 && (
          <div className="mb-4">
            <div className="text-center text-3xl font-bold mb-4">
              Get it from
            </div>
            <div className="flex justify-center items-center gap-4 py-4">
              {game.downloadLinks.map((link, idx) => (
                <PlatformButton
                  key={idx}
                  platform={link.platform}
                  url={link.url}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
