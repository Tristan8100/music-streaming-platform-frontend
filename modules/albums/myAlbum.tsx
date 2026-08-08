// page.tsx
'use client';

import { useUserAlbums } from "./hook";
import { Separator } from "@/components/ui/separator";
import { DialogDemo } from "./add-album";
import Link from "next/link";
import { Album } from "./types";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Music } from "lucide-react";
import { AlbumCardSkeleton } from "@/components/animated-skeleton";

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
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

export default function MyAlbumsPage() {
  const { albums, isLoading, refreshAlbums } = useUserAlbums();

  useEffect(() => {
    refreshAlbums();
  }, [refreshAlbums]);

  return (
    <>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Albums</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your music collection
            </p>
          </div>

          <DialogDemo onSuccess={refreshAlbums}>
            <Button className="bg-green-500 hover:bg-green-600 gap-2">
              <Plus className="w-4 h-4" />
              New Album
            </Button>
          </DialogDemo>
        </div>
      </motion.div>

      <Separator className="mb-8" />

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <AlbumCardSkeleton />
            </motion.div>
          ))}
        </div>
      ) : albums.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24"
        >
          <Music className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Albums Yet</h3>
          <p className="text-muted-foreground mb-6 text-center">
            Create your first album to get started
          </p>
          <DialogDemo onSuccess={refreshAlbums}>
            <Button className="bg-green-500 hover:bg-green-600 gap-2">
              <Plus className="w-4 h-4" />
              Create Album
            </Button>
          </DialogDemo>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {albums.map((album) => (
            <AlbumGridItem
              key={album._id}
              album={album}
              refreshAlbums={refreshAlbums}
            />
          ))}
        </motion.div>
      )}
    </>
  );
}

interface AlbumGridItemProps {
  album: Album;
  refreshAlbums: () => void;
}

function AlbumGridItem({
  album,
  refreshAlbums,
}: AlbumGridItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <Link
        href={`/user/my-albums/${album._id}`}
        className="block overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        {/* Album Cover */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
          {album.photo_url ? (
            <motion.img
              src={album.photo_url}
              alt={album.title}
              className="object-cover w-full h-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Music className="w-12 h-12 text-white opacity-50" />
            </div>
          )}

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />

          {/* Edit Button */}
          <motion.div
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
          >
            <DialogDemo
              id={album._id}
              album={album}
              onSuccess={refreshAlbums}
            >
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
              >
                Edit
              </Button>
            </DialogDemo>
          </motion.div>
        </div>

        {/* Album Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-green-500 transition-colors">
            {album.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {album.description || "No description"}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{album.genre_album?.length || 0} genres</span>
            <span className="text-green-500 font-medium">View →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}