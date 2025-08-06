import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import WorkTogetherForm from "./form";

export default function ServicesPage() {
  return (
    <div className="w-full -mt-px space-y-6 mb-6 bg-secondary">
      <div className="py-8 md:px-8 space-y-2 bg-primary text-white">
        <div className="w-[94%] sm:container mx-auto space-y-8">
          <div className="">
            <h2 className="text-2xl text-center font-semibold">
              WHY HENMOVA FOR
            </h2>
            <h1 className="sm:text-4xl text-3xl text-center font-extrabold">
              GAME DEVELOPMENT
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Unity game development",
                desc: "Experience the magic of Unity game development in both 2D and 3D dimensions! Our expert team brings your ideas to life with precision and creativity, crafting immersive experiences that captivate players. Whether you're diving into classic 2D adventures or exploring dynamic 3D worlds, we're here to turn your vision into reality with seamless gameplay and stunning visuals.",
                icon: "/unity-69.svg",
              },
              {
                title: "Unreal Engine Development",
                desc: "Dive into the world of Unreal Engine game development for an unparalleled gaming experience! Our skilled team harnesses the power of Unreal Engine to create immersive games with breathtaking visuals and seamless gameplay. Whether you're exploring vast 3D worlds or engaging in intense action, we bring your ideas to life with precision and excellence, delivering unforgettable gaming adventures.",
                icon: "/unreal-1.svg",
              },
              {
                title: "PC and Mobile Games",
                desc: "Unlock the world of gaming on any platform with our PC and mobile game development services! Whether you prefer the precision of a mouse and keyboard or the convenience of gaming on the go, we've got you covered. Our team crafts captivating experiences tailored to each platform, ensuring seamless gameplay and maximum enjoyment for players everywhere.",
                icon: "/icons/service.png",
              },
            ].map(({ desc, title, icon }, idx) => (
              <Card
                key={idx}
                className="overflow-hidden rounded-2xl border-none shadow-md shadow-black/40"
              >
                <CardHeader className="text-white bg-[#3F3F3F] flex flex-row items-center gap-2">
                  <Image
                    draggable={false}
                    src={icon}
                    width={50}
                    height={50}
                    alt={title}
                  />
                  <CardTitle className="text-lg w-full text-center font-bold uppercase leading-tight">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">{desc}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div className="w-[94%] sm:container mx-auto space-y-8 py-8">
        <div className="text-primary text-center">
          <h5 className="text-xl font-bold">LET&apos;S</h5>
          <h1 className="text-3xl font-extrabold">WORK TOGETHER</h1>
        </div>
        <div className="max-w-lg mx-auto bg-[#3F3F3F] text-white p-6 rounded-md">
          <WorkTogetherForm />
        </div>
      </div>
    </div>
  );
}
