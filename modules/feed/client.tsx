// page.tsx
'use client';

import Link from 'next/link';
import { useFeedData } from './hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Play } from 'lucide-react';
import { ArtistFollowing, Album, Song } from './types';

export default function FeedPage() {
  const { followings, albums, songs, isLoading } = useFeedData();

  if (isLoading) {
    return <div className="p-6 text-center">Loading feed...</div>;
  }

  return (
    <div className="space-y-12">
      {/* Artists Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Artists</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {followings.length === 0 ? (
            <div>No followings</div>
          ) : (
            followings.map((artist) => <ArtistCard key={artist._id} artist={artist} />)
          )}
        </div>
        <Link href="/artist" className="text-blue-500 hover:underline">View All</Link>
      </div>

      {/* Albums Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Albums</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {albums.map((album) => <AlbumCard key={album._id} album={album} />)}
        </div>
        <Link href="/albums" className="text-blue-500 hover:underline">View All</Link>
      </div>

      {/* Songs Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Songs</h2>
        <div className="space-y-3">
          {songs.map((song) => <SongRow key={song._id} song={song} />)}
        </div>
        <Link href="/songs" className="text-blue-500 hover:underline">View All</Link>
      </div>
    </div>
  );
}

/* =================================---------
   Sub-Components (Can be split into separate files if desired)
   ========================================= */

function ArtistCard({ artist }: { artist: ArtistFollowing }) {
  return (
    <div className="flex flex-col items-center flex-shrink-0">
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
        <div className="text-sm font-medium text-center max-w-[112px] truncate">
          {artist.following?.name}
        </div>
      </Link>
    </div>
  );
}

function AlbumCard({ album }: { album: Album }) {
  return (
    <Card className="flex-shrink-0 w-48 hover:shadow-lg transition-shadow">
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
  );
}

function SongRow({ song }: { song: Song }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
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
  );
}