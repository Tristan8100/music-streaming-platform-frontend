"use client";

import { useEffect, useState } from "react";
import AlbumListHook from "@/modules/albums/albumListHook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowUp, ArrowDown } from "lucide-react";

export default function AlbumList() {
  const { albums, isLoading, error, fetchAllAlbums, page, sort, search } = AlbumListHook();
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

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Albums</h1>
        <p className="text-gray-500">Browse and discover all available albums</p>
      </div>

      {/* Filters Section */}
      <div className="space-y-4 rounded-lg border bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search albums..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date (Newest)</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Albums Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : albums.length > 0
          ? albums.map((album) => (
              <Card key={album._id} className="overflow-hidden transition-transform hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-200">
                    {album.photo_url ? (
                      <img
                        src={album.photo_url}
                        alt={album.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-white font-semibold">{album.title?.[0]}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardHeader className="space-y-2">
                  <CardTitle className="line-clamp-2 text-lg">{album.title}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {album.owner.name || "Unknown Artist"}
                  </CardDescription>
                  <div className="text-xs text-gray-500">
                    {album.songCount || 0} songs
                  </div>
                </CardHeader>
              </Card>
            ))
          : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No albums found. Try adjusting your filters.</p>
            </div>
          )}
      </div>

      {/* Pagination */}
      {albums.length > 0 && (
        <div className="flex justify-center gap-2 pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </Button>
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm font-medium">Page {currentPage}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={albums.length === 0}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}