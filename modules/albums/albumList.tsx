"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AlbumListHook from "@/modules/albums/albumListHook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { AlbumCard } from "@/components/album-card";
import { AlbumCardSkeleton } from "@/components/animated-skeleton";
import { useDispatch } from "react-redux";
import { setCurrentSong, setCurrentCover } from "@/store/store";

export default function AlbumList() {
  const dispatch = useDispatch();
  const { albums, isLoading, error, fetchAllAlbums, page, sort, search } =
    AlbumListHook();
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchAllAlbums(currentPage, searchInput, sortBy);
  }, [currentPage, searchInput, sortBy]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
  };

  const handleSort = (sortValue: string) => {
    setSortBy(sortValue);
    setCurrentPage(1);
  };

  const handlePlayAlbum = (albumId: string) => {
    // Dispatch first song from album to player
    const album = albums.find((a) => a._id === albumId);
    if (album) {
      dispatch(
        setCurrentSong({
          _id: album._id,
          name: album.title,
          album_id: album._id,
          user_id: album.owner._id,
          genre_song: album.genre_album || [],
          plays: 100,
          likes_count: 50,
          song_local_path: "",
          song_url: "", // Would need actual song data
          created_at: "",
          updated_at: "",
        })
      );
      dispatch(setCurrentCover(album.photo_url || ""));
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold tracking-tight">Albums</h1>
        <p className="text-muted-foreground">
          Browse and discover all available albums
        </p>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-lg border bg-card p-6 space-y-4"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search albums by title or artist..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              <option value="date">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive"
        >
          <p className="font-semibold">Error loading albums</p>
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Albums Grid */}
      <div>
        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        ) : albums.length > 0 ? (
          <motion.div
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {albums.map((album, index) => (
              <motion.div
                key={album._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <AlbumCard
                  album={album}
                  onPlayClick={handlePlayAlbum}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <h3 className="text-xl font-semibold mb-2">No Albums Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && albums.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 pt-8"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="px-6 py-2 rounded-lg border bg-card">
            <span className="text-sm font-semibold">Page {currentPage}</span>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={albums.length === 0}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}