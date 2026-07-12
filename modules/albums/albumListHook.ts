// useAlbumList.ts
import { useState, useCallback } from "react";
import { api2 } from "@/lib/api";
import { Album } from "./types";

export default function AlbumListHook() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>('date');
  const [search, setSearch] = useState<string>('');

  const fetchAllAlbums = useCallback(async (pageNum: number = 1, searchQuery?: string, sortBy?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      if (searchQuery) params.append('search', searchQuery);
      if (sortBy) params.append('sort', sortBy);

      const response = await api2.get<{ data: Album[] }>(`/music/albums?${params.toString()}`);
      setAlbums(response.data.data);
      setPage(pageNum);
      if (searchQuery) setSearch(searchQuery);
      if (sortBy) setSort(sortBy);
      setSuccess("Albums fetched successfully");
    } catch (error) {
      console.error("Failed to fetch albums:", error);
      setError("Failed to fetch albums");
    } finally {
      setIsLoading(false);
    }
  }, []);

  console.log("Albums:", albums);

  return {
    albums,
    isLoading,
    error,
    success,
    setError,
    setSuccess,
    page,
    sort,
    search,
    fetchAllAlbums
  };
}