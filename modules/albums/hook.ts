// useUserAlbums.ts
import { useState, useEffect, useCallback } from "react";
import { api2 } from "@/lib/api";
import { Album } from "./types";

export function useUserAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAlbums = useCallback(async () => {
    try {
      const response = await api2.get<Album[]>('/music/albums-user');
      setAlbums(response.data);
    } catch (error) {
      console.error("Failed to fetch user albums:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return {
    albums,
    isLoading,
    refreshAlbums: fetchAlbums
  };
}