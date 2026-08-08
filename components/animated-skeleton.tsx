'use client';

import { cn } from "@/lib/utils";

interface AnimatedSkeletonProps {
  className?: string;
  count?: number;
}

export function AnimatedSkeleton({ className, count = 1 }: AnimatedSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-lg bg-gray-200",
            className
          )}
        />
      ))}
    </>
  );
}

export function AlbumCardSkeleton() {
  return (
    <div className="space-y-3">
      <AnimatedSkeleton className="h-48 w-full rounded-lg" />
      <AnimatedSkeleton className="h-4 w-3/4" />
      <AnimatedSkeleton className="h-3 w-1/2" />
      <AnimatedSkeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SongRowSkeleton() {
  return (
    <div className="flex gap-4 items-center">
      <AnimatedSkeleton className="h-12 w-12 rounded" />
      <div className="flex-1 space-y-2">
        <AnimatedSkeleton className="h-4 w-3/4" />
        <AnimatedSkeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function PlayerSkeletons() {
  return (
    <div className="space-y-4">
      <AnimatedSkeleton className="h-64 w-full rounded-xl" />
      <AnimatedSkeleton className="h-6 w-3/4" />
      <AnimatedSkeleton className="h-4 w-1/2" />
      <AnimatedSkeleton className="h-2 w-full" />
    </div>
  );
}
