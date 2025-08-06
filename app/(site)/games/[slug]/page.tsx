import { ContentService } from "@/lib/content";
import { Game } from "@/lib/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import GameDetail from "./components/game-detail";

export async function generateStaticParams() {
  const result = await ContentService.games.getAll();
  return result.items.map((game) => ({ slug: game.slug }));
}

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const game = await ContentService.games.getBySlug(slug);

    return {
      title: `${game.title} - Henmova Games`,
      description: game.tagline,
      openGraph: {
        title: game.title,
        description: game.tagline,
        images: [
          {
            url: game.coverImage.src,
            width: game.coverImage.width,
            height: game.coverImage.height,
            alt: game.title,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Game Not Found - Henmova",
      description: "The requested game could not be found.",
    };
  }
}

export default async function GamePage({ params }: GamePageProps) {
  let game: Game;

  try {
    const { slug } = await params;
    game = await ContentService.games.getBySlug(slug);
  } catch (error) {
    const { slug } = await params;
    console.error(`Failed to fetch game with slug "${slug}":`, error);
    notFound();
  }

  return <GameDetail game={game} />;
}
