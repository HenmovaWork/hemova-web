import BlogsSection from "@/components/site/blogs-sections";
import Carousel from "@/components/site/carousel";
import LatestGames from "@/components/site/latest-games";
import ServicesSection from "@/components/site/services-section";
import { WhatWeDo } from "@/components/site/what-we-do";
import { ContentService } from "@/lib/content";
import { Slide, Game } from "@/lib/types";

export default async function Home() {
  // Fetch content from Keystatic
  let slides: Slide[] = [];
  let games: Game[] = [];

  try {
    slides = await ContentService.slides.getActive();
    games = await ContentService.games.getFeatured(8);
  } catch (error) {
    console.error("Failed to fetch homepage content:", error);
    slides = [];
    games = [];
  }

  return (
    <div className="bg-[#F9FCFF] -mt-px select-none sel">
      {slides && slides.length > 0 && <Carousel slides={slides} />}
      <WhatWeDo />
      {games && games.length > 0 && <LatestGames games={games} />}
      <ServicesSection />
      <BlogsSection />
    </div>
  );
}
