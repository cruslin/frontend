import { cn } from "@/lib/utils";
import Link from "next/link";
import Button from "./Button";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  day: string;
  month: string;
  href: string;
  className?: string;
}

export default function EventCard({
  title,
  description,
  date,
  day,
  month,
  href,
  className,
}: EventCardProps) {
  return (
    <div
      className={cn(
        "flex gap-4 rounded-[4px] border-l-4 border-l-purple bg-white p-4 shadow-sm",
        "transition-shadow duration-200 hover:shadow-md",
        className
      )}
    >
      {/* Date badge */}
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-[8px] bg-purple text-white">
        <span className="font-heading text-lg font-bold leading-tight">
          {day}
        </span>
        <span className="font-heading text-[10px] font-semibold uppercase">
          {month}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-heading text-base sm:text-lg font-semibold text-slate truncate">
          {title}
        </h3>
        <p className="font-body text-sm text-gray-text line-clamp-2">
          {description}
        </p>
        <p className="text-body-small mt-1">{date}</p>
        <Link href={href} className="mt-2 self-start">
          <Button variant="primary" className="text-xs py-2 px-4 min-w-0">
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
}
