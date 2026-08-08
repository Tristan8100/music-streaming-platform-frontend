'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  repeat?: 'off' | 'all' | 'one';
  onRepeatChange?: () => void;
  isShuffle?: boolean;
  onShuffleChange?: () => void;
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onNextTrack,
  onPreviousTrack,
  currentTime = 0,
  duration = 0,
  onSeek,
  onVolumeChange,
  volume = 70,
  repeat = 'off',
  onRepeatChange,
  isShuffle = false,
  onShuffleChange,
}: PlayerControlsProps) {
  const [isSliding, setIsSliding] = useState(false);
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  // Handle progress bar drag
  const handleMouseDown = () => {
    setIsSliding(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isSliding || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newTime = (newProgress / 100) * duration;

    setDragProgress(newProgress);
    onSeek?.(newTime);
  };

  const handleMouseUp = () => {
    setIsSliding(false);
    setDragProgress(null);
  };

  // Add/remove mouse move listener when sliding starts/stops
  useEffect(() => {
    if (isSliding) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isSliding, duration]);

  return (
    <div className="w-full space-y-3">
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-8">
            {formatTime(isSliding && dragProgress !== null ? (dragProgress / 100) * duration : currentTime)}
          </span>
          <div
            ref={progressBarRef}
            className="flex-1 h-2 bg-gray-300 rounded-full cursor-pointer group hover:h-3 transition-all"
            onMouseDown={handleMouseDown}
            onClick={(e) => {
              if (!isSliding) {
                const rect = e.currentTarget.getBoundingClientRect();
                const newTime = (e.clientX - rect.left) / rect.width * duration;
                onSeek?.(newTime);
              }
            }}
          >
            <div
              className={cn(
                "h-full bg-green-500 rounded-full transition-all",
                isSliding && "bg-green-600",
                !isSliding && "group-hover:bg-green-400"
              )}
              style={{ width: `${dragProgress !== null ? dragProgress : progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={onShuffleChange}
          className={cn("rounded-full", isShuffle && "text-green-500")}
        >
          <Shuffle className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={onPreviousTrack}
          className="rounded-full"
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        {/* Play/Pause */}
        <Button
          size="lg"
          onClick={onPlayPause}
          className="rounded-full bg-green-500 hover:bg-green-600"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-white" />
          ) : (
            <Play className="w-6 h-6 fill-white" />
          )}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={onNextTrack}
          className="rounded-full"
        >
          <SkipForward className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={onRepeatChange}
          className={cn("rounded-full", repeat !== 'off' && "text-green-500")}
        >
          <Repeat className="w-5 h-5" />
          {repeat === 'one' && <span className="text-xs absolute">1</span>}
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 px-4">
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange?.(Number(e.target.value))}
          className="flex-1 h-1 bg-gray-300 rounded-full cursor-pointer appearance-none"
          style={{
            background: `linear-gradient(to right, rgb(34, 197, 94) 0%, rgb(34, 197, 94) ${volume}%, rgb(209, 213, 219) ${volume}%, rgb(209, 213, 219) 100%)`
          }}
        />
        <span className="text-xs text-muted-foreground w-6 text-right">{volume}%</span>
      </div>
    </div>
  );
}
