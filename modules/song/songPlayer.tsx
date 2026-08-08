'use client';

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState } from '@/store/store';
import { clearSong } from '@/store/store';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { PlayerControls } from '@/components/player-controls';
import { GenreTagGroup } from '@/components/genre-tag';
import { X, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MusicPlayer() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(70);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );

    const currentCover = useSelector(
        (state: RootState) => state.song.currentCover
    );

    // Handle play/pause
    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle seek
    const handleSeek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    // Handle volume
    const handleVolumeChange = (vol: number) => {
        setVolume(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol / 100;
        }
    };

    // Handle repeat
    const handleRepeatChange = () => {
        setRepeat((prev) => {
            if (prev === 'off') return 'all';
            if (prev === 'all') return 'one';
            return 'off';
        });
    };

    // Update time
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            if (repeat === 'one') {
                audio.currentTime = 0;
                audio.play();
            } else {
                setIsPlaying(false);
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [repeat]);

    // Auto play when song changes
    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.src = currentSong.song_url;
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentSong]);

    if (!currentSong) return null;

    return (
        <>
            {/* Mini Player */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                onClick={() => setOpen(true)}
                className="fixed bottom-20 md:bottom-6 right-6 z-40 w-80 cursor-pointer group"
            >
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 rounded-xl border bg-gradient-to-r from-background to-background/80 p-4 shadow-2xl backdrop-blur-md hover:shadow-2xl transition-shadow"
                >
                    {/* Album Art */}
                    <motion.div
                        className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg"
                        whileHover={{ scale: 1.05 }}
                    >
                        <img
                            src={currentCover || '/placeholder.png'}
                            alt={currentSong.name}
                            className="h-full w-full object-cover"
                        />
                        {isPlaying && (
                            <motion.div
                                className="absolute inset-0 bg-black/20"
                                animate={{ opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}
                    </motion.div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                        <motion.p
                            className="truncate font-semibold text-sm"
                            layoutId="songTitle"
                        >
                            {currentSong.name}
                        </motion.p>
                        <p className="truncate text-xs text-muted-foreground">
                            {currentSong.user_id || 'Unknown Artist'}
                        </p>
                        <div className="mt-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-green-500"
                                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                            />
                        </div>
                    </div>

                    {/* Mini Controls */}
                    <motion.div
                        className="flex gap-2"
                        whileHover={{ gap: 8 }}
                    >
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePlayPause();
                            }}
                            className="rounded-full h-8 w-8"
                        >
                            {isPlaying ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                                dispatch(clearSong());
                            }}
                            className="rounded-full h-8 w-8"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Full Player Drawer */}
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="h-screen bg-gradient-to-b from-background to-background/50">
                    <DrawerHeader className="flex items-center justify-between">
                        <DrawerTitle>Now Playing</DrawerTitle>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="w-5 h-5" />
                            </Button>
                        </DrawerClose>
                    </DrawerHeader>

                    {currentSong && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center px-6 py-8"
                        >
                            {/* Large Album Art */}
                            <motion.div
                                className="relative mb-8"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                            >
                                <motion.div
                                    className="absolute inset-0 rounded-3xl blur-3xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(99, 102, 241))',
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                />
                                <img
                                    src={currentCover || '/placeholder.png'}
                                    alt={currentSong.name}
                                    className="relative w-72 h-72 rounded-3xl object-cover shadow-2xl"
                                />
                            </motion.div>

                            {/* Song Info */}
                            <motion.div className="text-center mb-8 w-full" layoutId="songInfo">
                                <h2 className="text-3xl font-bold mb-2">{currentSong.name}</h2>
                                <p className="text-lg text-muted-foreground mb-4">
                                    {currentSong.user_id || 'Unknown Artist'}
                                </p>

                                {/* Genre Tags */}
                                {currentSong.genre_song && currentSong.genre_song.length > 0 && (
                                    <div className="flex justify-center mb-6">
                                        <GenreTagGroup genres={currentSong.genre_song.slice(0, 3)} />
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex justify-around text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Plays</p>
                                        <p className="font-semibold">{currentSong.plays || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Likes</p>
                                        <p className="font-semibold">{currentSong.likes_count || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Duration</p>
                                        <p className="font-semibold">{duration.toFixed(0)}s</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Player Controls */}
                            <div className="w-full mb-8">
                                <PlayerControls
                                    isPlaying={isPlaying}
                                    onPlayPause={handlePlayPause}
                                    onNextTrack={() => {}}
                                    onPreviousTrack={() => {}}
                                    currentTime={currentTime}
                                    duration={duration}
                                    onSeek={handleSeek}
                                    volume={volume}
                                    onVolumeChange={handleVolumeChange}
                                    repeat={repeat}
                                    onRepeatChange={handleRepeatChange}
                                    isShuffle={isShuffle}
                                    onShuffleChange={() => setIsShuffle(!isShuffle)}
                                />
                            </div>

                            {/* Share & Options */}
                            <div className="flex gap-4 w-full">
                                <Button variant="outline" className="flex-1">
                                    Share
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    Add to Playlist
                                </Button>
                            </div>

                            {/* Hidden Audio Element */}
                            <audio
                                ref={audioRef}
                                src={currentSong.song_url}
                                onEnded={() => setIsPlaying(false)}
                            />
                        </motion.div>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}