'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Heart, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api2 } from '@/lib/api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';


export interface Following {
  _id: string;
  name: string;
  photo_url?: string;
}

export interface ArtistFollowing {
  _id: string;
  following: Following;
}

export interface AlbumOwner {
  _id: string;
  email: string;
  name: string;
  photo_url?: string;
}

export interface Album {
  _id: string;
  title: string;
  owner: AlbumOwner;
  genre_album: string[];
  photo_local_path: string;
  photo_url: string;
  description?: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface Song {
  _id: string;
  name: string;
  plays: number;
  likes_count: number;
  song_url: string;
}


export default function FeedPage() {
  const [followings, setFollowings] = useState<ArtistFollowing[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/*Artists*/}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Artists</h2>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {followings.length === 0 ? (
            <div>No followings</div>
          ) : (
            followings.map((artist) => (
              <div key={artist._id} className="flex flex-col items-center flex-shrink-0">
                <Link href={`/artist/${artist.following?._id}`}>
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 mb-2">
                    {artist.following?.photo_url ? (
                      <img
                        src={artist.following.photo_url}
                        alt={artist.following.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Avatar className="w-28 h-28">
                        <AvatarFallback>
                          {artist.following?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  <span className="text-sm font-medium text-center">
                    {artist.following?.name}
                  </span>
                </Link>
              </div>
            ))
          )}
        </div>
        <Link href="/artist" className='text-blue-500'>View All</Link>
      </div>

      {/*  Albums */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Albums</h2>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {albums.map((album) => (
            <Card key={album._id} className="flex-shrink-0 w-48 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="w-full h-40 bg-gray-200 rounded-md mb-3 overflow-hidden">
                  <img
                    src={album.photo_url}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-semibold text-sm truncate">{album.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
        <Link href="/albums" className='text-blue-500'>View All</Link>
      </div>

      {/* Songs*/}
      <div>
        <h2 className="text-2xl font-bold mb-6">Songs</h2>

        <div className="space-y-3">
          {songs.map((song) => (
            <div
              key={song._id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700">
                  <Play className="w-4 h-4 text-white fill-white" />
                </button>

                <span className="font-medium">{song.name}</span>
              </div>

              <div className="flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{song.likes_count.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>{song.plays.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/songs" className='text-blue-500'>View All</Link>
      </div>
    </div>
  );
}
