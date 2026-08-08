'use client';
import { Button } from "@/components/ui/button";
import { useUserAlbums } from "@/modules/albums/hook";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { setCurrentSong, setCurrentCover } from '@/store/store';
import CreateSongDialog from "@/modules/song/createSong";
import EditSongDialog from "@/modules/song/editSong";
import { motion } from "framer-motion";
import { GenreTagGroup } from "@/components/genre-tag";
import { Play, Plus, Music, Heart, MoreVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function AlbumDetailPage() {
    const params = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const [isLiked, setIsLiked] = useState(false);

    const { 
        albumSongs,
        fetchOneAlbumWithSongs,
        isLoading
    } = useUserAlbums();

    useEffect(() => {
        fetchOneAlbumWithSongs(params.id);
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="space-y-4">
                    <div className="h-12 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    if (!albumSongs) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Music className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-xl font-semibold">Album not found</h2>
            </div>
        );
    }

    const totalSongs = albumSongs.songs.length;
    const totalPlays = albumSongs.songs.reduce((sum, song) => sum + (song.plays || 0), 0);
    const totalLikes = albumSongs.songs.reduce((sum, song) => sum + (song.likes_count || 0), 0);

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl p-8 md:p-12 border border-border"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Album Art */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="md:col-span-1"
                    >
                        <div className="relative">
                            <motion.div
                                className="absolute inset-0 rounded-2xl blur-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(99, 102, 241))',
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            />
                            <img
                                src={albumSongs.data.photo_url || '/placeholder.png'}
                                alt={albumSongs.data.title}
                                className="relative w-full max-w-sm rounded-2xl object-cover shadow-xl"
                            />
                        </div>
                    </motion.div>

                    {/* Album Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Album
                            </p>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                                {albumSongs.data.title}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {albumSongs.data.description || "No description provided"}
                            </p>
                        </div>

                        {/* Genres */}
                        {albumSongs.data.genre_album && albumSongs.data.genre_album.length > 0 && (
                            <GenreTagGroup genres={albumSongs.data.genre_album} />
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                                <p className="text-xs text-muted-foreground font-medium">Songs</p>
                                <p className="text-2xl font-bold text-green-500">{totalSongs}</p>
                            </div>
                            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                                <p className="text-xs text-muted-foreground font-medium">Plays</p>
                                <p className="text-2xl font-bold text-green-500">{totalPlays.toLocaleString()}</p>
                            </div>
                            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                                <p className="text-xs text-muted-foreground font-medium">Likes</p>
                                <p className="text-2xl font-bold text-green-500">{totalLikes.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <Button className="bg-green-500 hover:bg-green-600 gap-2">
                                <Play className="w-4 h-4" />
                                Play All
                            </Button>
                            <CreateSongDialog
                                albumId={params.id}
                                onSuccess={() => fetchOneAlbumWithSongs(params.id)}
                            >
                                <Button variant="outline" className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Song
                                </Button>
                            </CreateSongDialog>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setIsLiked(!isLiked)}
                            >
                                <Heart className={isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <Separator />

            {/* Songs Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Songs</h2>
                    <span className="text-sm text-muted-foreground">{totalSongs} tracks</span>
                </div>

                {albumSongs.songs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 rounded-lg border-2 border-dashed border-border"
                    >
                        <Music className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No songs yet</h3>
                        <p className="text-muted-foreground mb-4 text-center">
                            Add your first song to this album
                        </p>
                        <CreateSongDialog
                            albumId={params.id}
                            onSuccess={() => fetchOneAlbumWithSongs(params.id)}
                        >
                            <Button className="bg-green-500 hover:bg-green-600 gap-2">
                                <Plus className="w-4 h-4" />
                                Add Song
                            </Button>
                        </CreateSongDialog>
                    </motion.div>
                ) : (
                    <div className="space-y-2">
                        {albumSongs.songs.map((song, index) => (
                            <SongRow
                                key={song._id}
                                song={song}
                                index={index}
                                albumId={params.id}
                                albumCover={albumSongs.data.photo_url}
                                onSuccess={() => fetchOneAlbumWithSongs(params.id)}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

interface SongRowProps {
    song: any;
    index: number;
    albumId: string;
    albumCover: string;
    onSuccess: () => void;
}

function SongRow({ song, index, albumId, albumCover, onSuccess }: SongRowProps) {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);

    const handlePlaySong = () => {
        dispatch(setCurrentSong(song));
        dispatch(setCurrentCover(albumCover));
    };

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group"
        >
            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors border border-border/0 group-hover:border-border">
                {/* Index */}
                <div className="w-8 text-center text-muted-foreground font-medium">
                    {index + 1}
                </div>

                {/* Play Button */}
                <motion.button
                    onClick={handlePlaySong}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileTap={{ scale: 0.95 }}
                >
                    <Play className="w-4 h-4 fill-white text-white" />
                </motion.button>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate group-hover:text-green-500 transition-colors">
                        {song.name}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>{(song.plays || 0).toLocaleString()} plays</span>
                        <span>•</span>
                        <span>{(song.likes_count || 0).toLocaleString()} likes</span>
                    </div>
                </div>

                {/* Duration */}
                <div className="text-sm text-muted-foreground">
                    {/* Add duration if available */}
                    0:00
                </div>

                {/* Actions */}
                <motion.div
                    className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ x: 10 }}
                    animate={{ x: isHovered ? 0 : 10 }}
                >
                    <EditSongDialog
                        song={song}
                        onSuccess={onSuccess}
                    >
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8"
                        >
                            Edit
                        </Button>
                    </EditSongDialog>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}