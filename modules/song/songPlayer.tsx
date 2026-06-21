'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';

export default function MusicPlayer() {
    const [open, setOpen] = useState(false);

    const currentSong = useSelector(
        (state: RootState) => state.song.currentSong
    );

    const currentCover = useSelector(
        (state: RootState) => state.song.currentCover
    );

    return (
        <>
            {/* Mini Player */}
            {currentSong && (
                <div
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-72 cursor-pointer"
                >
                    <div className="flex items-center gap-3 rounded-xl border bg-background p-3 shadow-lg">

                        <img
                            src={currentCover}
                            alt={currentSong.name}
                            className="h-14 w-14 rounded-md object-cover"
                        />

                        <div className="flex-1 overflow-hidden">
                            <p className="truncate font-medium">
                                {currentSong.name}
                            </p>

                            <p className="truncate text-sm text-muted-foreground">
                                {currentSong.user_id}
                            </p>
                        </div>

                        <span className="text-xl">🎵</span>
                    </div>
                </div>
            )}

            {/* Drawer */}
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Now Playing</DrawerTitle>
                    </DrawerHeader>

                    {currentSong && (
                        <div className="p-6">
                            <img
                                src={currentCover}
                                alt={currentSong.name}
                                width={300}
                                height={300}
                                className="mx-auto rounded-xl"
                            />

                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-bold">
                                    {currentSong.name}
                                </h2>

                                <p className="text-muted-foreground">
                                    {currentSong.user_id}
                                </p>
                            </div>

                            <audio controls className="w-full mt-6">
                                <source
                                    src={currentSong.song_url}
                                    type="audio/mpeg"
                                />
                            </audio>
                        </div>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}