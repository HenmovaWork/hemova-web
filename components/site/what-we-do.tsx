import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MyCard({
  title,
  desc,
  img,
}: {
  title: string;
  desc: string;
  img: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Image
            draggable={false}
            className="mx-auto sm:w-40 w-28"
            src={img}
            alt={title}
            width={160}
            height={160}
            quality={85}
            loading="lazy"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold text-primary mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-4 text-pretty">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}

export function WhatWeDo() {
  const data = [
    {
      title: "Games",
      img: "/icons/game.png",
      desc: "Experience the magic of our captivating games, each a masterpiece crafted with passion and precision. Dive into thrilling adventures, mind-bending puzzles, and captivating narratives that promise unforgettable experiences for players of all ages.",
    },
    {
      title: "Services",
      img: "/icons/services.png",
      desc: "Explore our array of services tailored to elevate your gaming experience. From game development and design to comprehensive support, we're dedicated to bringing your gaming vision to life with precision and excellence.",
    },
    {
      title: "Community",
      img: "/icons/community.png",
      desc: "Dive into our vibrant gaming community! Join fellow players in sharing tips, discussing strategies, and connecting over our shared love for gaming. Whether you're a casual gamer or a seasoned pro, there's always a place for you in our community. Let's embark on this gaming journey together!",
    },
  ];

  return (
    <div className="container mx-auto p-4 md:px-8 my-4 text-center">
      <h1 className="sm:text-4xl text-2xl font-bold mb-8">What We Do</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item) => (
          <MyCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}
