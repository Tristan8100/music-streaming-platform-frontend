// page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFeedData } from './hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Play, Music } from 'lucide-react';
import { ArtistFollowing, Album, Song } from './types';
import { AlbumCard } from '@/components/album-card';
import { GenreTag } from '@/components/genre-tag';
import { SongRowSkeleton } from '@/components/animated-skeleton';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { setCurrentSong, setCurrentCover } from '@/store/store';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function FeedPage() {
  const dispatch = useDispatch();
  const { followings, albums, songs, isLoading } = useFeedData();

  const handlePlaySong = (song: Song) => {
    dispatch(setCurrentSong(song));
  };

  if (isLoading) {
    return (
      <div className="space-y-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-4 overflow-x-auto">
              {Array.from({ length: 4 }).map((_, j) => (
                <SongRowSkeleton key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Artists Section */}
      {followings.length > 0 && (
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Your Artists</h2>
            <Link href="/user/popular" className="text-green-500 hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {followings.map((artist, idx) => (
              <motion.div
                key={artist._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ArtistCardComponent artist={artist} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Albums Section */}
      {albums.length > 0 && (
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Featured Albums</h2>
            <Link href="/user/popular/albums" className="text-green-500 hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {albums.slice(0, 4).map((album, idx) => (
              <motion.div
                key={album._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <AlbumCard album={album} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Songs Section */}
      {songs.length > 0 && (
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Popular Songs</h2>
            <Link href="/user/popular/songs" className="text-green-500 hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-2">
            {songs.slice(0, 10).map((song, idx) => (
              <motion.div
                key={song._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <SongRowComponent song={song} onPlay={handlePlaySong} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}

/* ===== Sub-Components ===== */

function ArtistCardComponent({ artist }: { artist: ArtistFollowing }) {
  return (
    <Link href={`/user/popular`}>
      <motion.div
        whileHover={{ y: -10 }}
        className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 mb-3 shadow-lg group-hover:shadow-xl transition-shadow"
        >
          {artist.following?.photo_url ? (
            <img
              src={artist.following.photo_url}
              alt={artist.following.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Avatar className="w-full h-full">
              <AvatarFallback className="text-lg">
                {artist.following?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
        </motion.div>
        <p className="text-sm font-semibold text-center max-w-[112px] truncate group-hover:text-green-500 transition-colors">
          {artist.following?.name}
        </p>
      </motion.div>
    </Link>
  );
}

function SongRowComponent({
  song,
  onPlay,
}: {
  song: Song;
  onPlay: (song: Song) => void;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent group transition-colors cursor-pointer"
    >
      {/* Play Icon */}
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onPlay(song)}
      >
        <Play className="w-4 h-4 fill-current" />
      </Button>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-sm">{song.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          Plays: {song.plays || 0}
        </p>
      </div>

      {/* Genre Tags */}
      {song.genre_song && song.genre_song.length > 0 && (
        <div className="hidden md:flex gap-2">
          {song.genre_song.slice(0, 1).map((genre) => (
            <GenreTag key={genre} genre={genre} size="sm" />
          ))}
        </div>
      )}

      {/* Like & Stats */}
      <div className="flex items-center gap-4 opacity-75 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-muted-foreground">
          {song.likes_count || 0} likes
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 rounded-full"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}