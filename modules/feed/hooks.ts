// useFeedData.ts
import { useState, useEffect } from 'react';
import { api2 } from '@/lib/api';
import { ArtistFollowing, Album, Song, PaginatedResponse } from './types';

export function useFeedData() {
  const [followings, setFollowings] = useState<ArtistFollowing[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [followingsPage, setFollowingsPage] = useState<number>(1);
  const [albumsPage, setAlbumsPage] = useState<number>(1);
  const [songsPage, setSongsPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [followingsRes, albumsRes, songsRes] = await Promise.all([
          api2.get<{ data: ArtistFollowing[] }>(`/users/following?page=${followingsPage}&limit=${limit}`),
          api2.get<PaginatedResponse<Album>>(`/music/albums?page=${albumsPage}&limit=${limit}`),
          api2.get<PaginatedResponse<Song>>(`/music/songs-all?page=${songsPage}&limit=${limit}`),
        ]);

        setFollowings(followingsRes.data.data);
        setAlbums(albumsRes.data.data);
        setSongs(songsRes.data.data);
      } catch (error) {
        console.error('Feed fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [followingsPage, albumsPage, songsPage, limit]);

  return { followings, albums, songs, isLoading, setLimit };
}