'use client';

import { getGenreColor } from "@/lib/genre-colors";
import { cn } from "@/lib/utils";

interface GenreTagProps {
  genre: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function GenreTag({ genre, className, size = "sm" }: GenreTagProps) {
  const color = getGenreColor(genre);
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      className={cn(
        "inline-block rounded-full border font-medium whitespace-nowrap",
        color.bg,
        color.text,
        color.border,
        sizeClasses[size],
        className
      )}
    >
      {genre}
    </span>
  );
}

export function GenreTagGroup({ genres, className }: { genres: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {genres.map((genre) => (
        <GenreTag key={genre} genre={genre} size="sm" />
      ))}
    </div>
  );
}
