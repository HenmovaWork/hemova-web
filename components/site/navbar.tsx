import ActiveLink from "./active-link";
import MobileNav from "./mobile-nav";

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Games",
    href: "/games",
  },
  {
    name: "Services",
    href: "/services",
  },
  {
    name: "Jobs",
    href: "/jobs",
  },
  {
    name: "News",
    href: "/news",
  },
];

export default function Navbar() {
  return (
    <div className="bg-background z-50 sticky top-0 h-16 border-b-2 border-primary">
      <header className="flex h-full items-center gap-4 container mx-auto px-4 md:px-8">
        <MobileNav links={links} />
        <div className="hidden sm:flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            {links.map((link) => (
              <ActiveLink key={link.href} href={link.href}>
                {link.name}
              </ActiveLink>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}
