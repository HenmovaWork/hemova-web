import { cn } from "@/lib";
import Image from "next/image";
import Link from "next/link";

export default function ServicesSection() {
  const data = [
    {
      color: "#256FFF",
      title: "Our Services",
      desc: "Love games? We've got you covered! We make cool 2D/3D adventures and web games that pop. Whether you play on PC or mobile, our Unity and Unreal experts have you covered. We'll even spruce up your favorite games or fix any bugs. Let's level up your gaming fun!",
      img: "/service/cover.png",
      button: {
        title: "Services",
        href: "/service",
      },
    },
    {
      color: "#FF0000",
      title: "Career at Henmova",
      desc: "We want to provide you with a platform to grow and excel as an individual, unleash your potential and make an impact in your region. Join our team of passionate game developers and help create the next generation of amazing games.",
      img: "/service/cover2.png",
      button: {
        title: "Apply Today",
        href: "/jobs",
      },
    },
  ];

  const ImageComponent = ({ img, title,className }: { title: string; img: string,className?:string }) => {
    return (
      <div className={cn(
        "w-full md:w-1/2 overflow-hidden rounded-md",
        className || ""
      )}>
        <Image
        draggable={false}
          src={img}
          alt={title}
          className="w-full rounded-md"
          width={640}
          height={425}
          quality={85}
          loading="lazy"
        />
      </div>
    );
  };

  const TextComponent = ({
    color,
    title,
    desc,
    button,
  }: {
    color: string;
    title: string;
    desc: string;
    button: {
      title: string;
      href: string;
    };
  }) => {
    return (
      <div className="md:w-1/2 p-4 md:p-8">
        <h1
          className={`text-3xl sm:text-4xl font-bold mb-8`}
          style={{
            color: color,
          }}
        >
          {title}
        </h1>
        <p className="text-lg">{desc}</p>
        <div className="mt-6">
          <Link
            href={button.href}
            style={{
              backgroundColor: color,
            }}
            className={`px-5 py-2 text-lg text-white rounded-md hover:opacity-90 transition-opacity`}
          >
            {button.title}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-8 md:px-8">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-4 md:flex-row "
        >
          {index % 2 === 0 ? (
            <>
              <TextComponent
                color={item.color}
                title={item.title}
                desc={item.desc}
                button={item.button}
              />
              <ImageComponent img={item.img} title={item.title} className="max-md:hidden" />
            </>
          ) : (
            <>
              <ImageComponent img={item.img} title={item.title} />
              <TextComponent
                color={item.color}
                title={item.title}
                desc={item.desc}
                button={item.button}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
