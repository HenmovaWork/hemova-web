import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Title({ children, className }: Props) {
  return (
    <div
      className={cn(
        "sm:text-4xl text-center text-2xl font-semibold",
        className,
      )}
    >
      {children}
    </div>
  );
}
