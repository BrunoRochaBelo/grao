import { motion } from "motion/react";
import type { Moment, Chapter } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";

export function RecentMomentCard({
  moment,
  chapter,
  icon,
  caption,
  dateLabel,
  delay,
  media,
  onOpen,
  onLongPressStart,
  onLongPressEnd,
}: {
  moment: Moment;
  chapter?: Chapter;
  icon: string;
  caption: string;
  dateLabel: string;
  delay: number;
  media: string[];
  onOpen: () => void;
  onLongPressStart: (
    event: ReactPointerEvent<HTMLButtonElement>,
    moment: Moment
  ) => void;
  onLongPressEnd: (event?: ReactPointerEvent<HTMLButtonElement>) => void;
}) {
  const cover = media[0];

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        delay: delay * 0.06,
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -6,
        boxShadow: "0 18px 32px rgba(15, 23, 42, 0.18)",
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onOpen}
      onPointerDown={(event) => onLongPressStart(event, moment)}
      onPointerUp={(event) => onLongPressEnd(event)}
      onPointerLeave={(event) => onLongPressEnd(event)}
      onPointerCancel={(event) => onLongPressEnd(event)}
      className="group relative break-inside-avoid rounded-3xl overflow-hidden border border-border/70 bg-card/95 text-left transition-all duration-300 backdrop-blur-sm"
      aria-label={`Abrir momento ${moment.title}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={moment.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-4xl">
            {icon}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-lg drop-shadow">{icon}</span>
          <Badge
            variant="secondary"
            className="bg-black/40 text-white hover:bg-black/50 backdrop-blur-sm"
          >
            {chapter?.name ?? "Capítulo"}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-medium text-white/90 drop-shadow">
          <span>{dateLabel}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-3">
        <p className="text-sm leading-tight text-foreground line-clamp-1">
          {caption}
        </p>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </motion.button>
  );
}
