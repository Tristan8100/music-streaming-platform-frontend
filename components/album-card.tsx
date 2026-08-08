'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Music } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GenreTagGroup } from './genre-tag';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AlbumCardProps {
  album: {
    _id: string;
    title: string;
    owner: {
      name: string;
      photo_url?: string;
    };
    photo_url?: string;
    genre_album?: string[];
    description?: string;
  };
  onPlayClick?: (albumId: string) => void;
  className?: string;
}

export function AlbumCard({ album, onPlayClick, className }: AlbumCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={cn("overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl", className)}>
        <CardContent className="p-0 relative">
          {/* Album Cover */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
            {album.photo_url ? (
              <motion.img
                src={album.photo_url}
                alt={album.title}
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Music className="w-12 h-12 text-white opacity-50" />
              </div>
            )}

            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div className="flex gap-3" initial={{ y: 10 }} animate={{ y: isHovered ? 0 : 10 }}>
                <Button
                  size="icon"
                  className="rounded-full bg-green-500 hover:bg-green-600"
                  onClick={(e) => {
                    e.preventDefault();
                    onPlayClick?.(album._id);
                  }}
                >
                  <Play className="w-4 h-4 fill-white" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLiked(!isLiked);
                  }}
                >
                  <Heart className={cn("w-4 h-4", isLiked && "fill-red-500 text-red-500")} />
                </Button>
              </motion.div>
            </motion.div>

            {/* Play Icon Badge */}
            {isHovered && (
              <motion.div
                className="absolute top-2 right-2 bg-green-500 rounded-full p-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Play className="w-4 h-4 fill-white text-white" />
              </motion.div>
            )}
          </div>
        </CardContent>

        {/* Album Info */}
        <CardHeader className="space-y-3 pb-4">
          <Link href={`/user/my-albums/${album._id}`}>
            <CardTitle className="line-clamp-2 text-base hover:text-green-500 transition-colors">
              {album.title}
            </CardTitle>
          </Link>
          
          <CardDescription className="line-clamp-1 text-xs">
            By {album.owner.name || "Unknown Artist"}
          </CardDescription>

          {/* Genre Tags */}
          {album.genre_album && album.genre_album.length > 0 && (
            <GenreTagGroup genres={album.genre_album.slice(0, 2)} />
          )}
        </CardHeader>
      </Card>
    </motion.div>
  );
}
