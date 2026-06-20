'use client';

import Image from 'next/image';
import { useState } from 'react';

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';

export default function MusicPlayer() {
    const [open, setOpen] = useState(false);

    const song = {
        title: 'Mock Song',
        artist: 'Mock Artist',
        cover: 'https://res.cloudinary.com/dmxsdk1bd/image/upload/v1779011095/file_storage/try/1779011093550-%283%29%20Facebook%20-%20Google%20Chrome%203_17_2026%205_50_20%20PM.png.png',
        song_url: 'https://res.cloudinary.com/dmxsdk1bd/video/upload/v1781920343/file_storage/music/1781920334458-1766829521248-Fractured%20Lines.mp3.mp3',
    };

    return (
        <>
            {/* Mini Player */}
            <div
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-72 cursor-pointer"
            >
                <div className="flex items-center gap-3 rounded-xl border bg-background p-3 shadow-lg">
                    <img
                        src={song.cover}
                        alt={song.title}
                        className="h-14 w-14 rounded-md object-cover"
                    />

                    <div className="flex-1 overflow-hidden">
                        <p className="truncate font-medium">
                            {song.title}
                        </p>

                        <p className="truncate text-sm text-muted-foreground">
                            {song.artist}
                        </p>
                    </div>

                    <span className="text-xl">🎵</span>
                </div>
            </div>

            {/* Drawer */}
            <Drawer
                open={open}
                onOpenChange={setOpen}
            >
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            Now Playing
                        </DrawerTitle>
                    </DrawerHeader>

                    <div className="p-6">
                        <img
                            src={song.cover}
                            alt={song.title}
                            width={300}
                            height={300}
                            className="mx-auto rounded-xl"
                        />

                        <div className="mt-4 text-center">
                            <h2 className="text-xl font-bold">
                                {song.title}
                            </h2>

                            <p className="text-muted-foreground">
                                {song.artist}
                            </p>
                        </div>

                        <audio
                            controls
                            className="w-full mt-6"
                        >
                            <source
                                src={song.song_url}
                                type="audio/mpeg"
                            />
                        </audio>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}