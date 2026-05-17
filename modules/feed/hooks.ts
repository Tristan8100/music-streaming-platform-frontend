// useFeedData.ts
import { useState, useEffect } from 'react';
import { api2 } from '@/lib/api';
import { ArtistFollowing, Album, Song, PaginatedResponse } from './types';

export function useFeedData() {
  const [followings, setFollowings] = useState<ArtistFollowing[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [followingsRes, albumsRes, songsRes] = await Promise.all([
          api2.get<ArtistFollowing[]>('/users/following'),
          api2.get<PaginatedResponse<Album>>('/music/albums'),
          api2.get<PaginatedResponse<Song>>('/music/songs-all'),
        ]);

        setFollowings(followingsRes.data);
        setAlbums(albumsRes.data.data);
        setSongs(songsRes.data.data);
      } catch (error) {
        console.error('Feed fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { followings, albums, songs, isLoading };
}