'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api2 } from '@/lib/api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export type Artist = {
    _id: string;
    following: Following //obj not array ah
};

export type Following = {
    _id: string;
    name: string;
    photo_url: string;
}

export default function FeedPage() {
    // Mock data
    const artists = [
        { id: 1, name: 'Artist One', image: 'https://via.placeholder.com/120' },
        { id: 2, name: 'Artist Two', image: 'https://via.placeholder.com/120' },
        { id: 3, name: 'Artist Three', image: 'https://via.placeholder.com/120' },
        { id: 4, name: 'Artist Four', image: 'https://via.placeholder.com/120' },
        { id: 5, name: 'Artist Five', image: 'https://via.placeholder.com/120' },
        { id: 6, name: 'Artist Six', image: 'https://via.placeholder.com/120' },
    ];

    const albums = [
        { id: 1, title: 'Album Title 1', cover: 'https://via.placeholder.com/200' },
        { id: 2, title: 'Album Title 2', cover: 'https://via.placeholder.com/200' },
        { id: 3, title: 'Album Title 3', cover: 'https://via.placeholder.com/200' },
        { id: 4, title: 'Album Title 4', cover: 'https://via.placeholder.com/200' },
        { id: 5, title: 'Album Title 5', cover: 'https://via.placeholder.com/200' },
    ];

    const songs = [
        { id: 1, title: 'Song Title 1', likes: 1250, streams: 45000 },
        { id: 2, title: 'Song Title 2', likes: 890, streams: 32000 },
        { id: 3, title: 'Song Title 3', likes: 2100, streams: 78000 },
        { id: 4, title: 'Song Title 4', likes: 567, streams: 21000 },
        { id: 5, title: 'Song Title 5', likes: 3400, streams: 120000 },
    ];

    // Actual fetch
    const [followings, setFollowings] = useState<Artist[] | []>([]);

    useEffect(() => {
        const fetchFollowings = async () => {
            const response = await api2.get('/users/following');
            console.log(response.data.following);
            setFollowings(response.data);
            console.log("ZA FOLLOWINGDS", followings);
        };
        fetchFollowings();
    }, []);

    return (
        <div>
            {/* Artists Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Artists</h2>
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {followings && followings.length > 0 ? (
                    followings.map((artist) => (
                    <div key={artist._id} className="flex flex-col items-center flex-shrink-0">
                        <Link href={`/artist/${artist.following?._id}`}> {/* CHANGEEE */}
                            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 mb-2">
                            {artist.following?.photo_url ? 
                                <img
                                    src={artist.following?.photo_url}
                                    alt={artist.following?.name}
                                    className="w-full h-full object-cover"
                                />
                            : 
                                <Avatar className="w-28 h-28">
                                    <AvatarFallback>{artist.following?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            }
                            </div>
                            <span className="text-sm font-medium text-center">{artist.following?.name}</span>
                        </Link>
                    </div>
                    ))
                ) : (
                    <div>No followings</div>
                )}
                </div>
                <button className="text-blue-600 hover:underline text-sm mt-4">View All</button>
            </div>

            {/* Albums Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Albums</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {albums.map((album) => (
                        <Card key={album.id} className="flex-shrink-0 w-48 hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <div className="w-full h-40 bg-gray-200 rounded-md mb-3 overflow-hidden">
                                    <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-semibold text-sm truncate">{album.title}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <button className="text-blue-600 hover:underline text-sm mt-4">View All</button>
            </div>

            {/* Songs Section */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Songs</h2>
                <div className="space-y-3">
                    {songs.map((song) => (
                        <div key={song.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700">
                                    <Play className="w-4 h-4 text-white fill-white" />
                                </button>
                                <span className="font-medium">{song.title}</span>
                            </div>
                            <div className="flex items-center gap-8 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-4 h-4" />
                                    <span>{song.likes.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Play className="w-4 h-4" />
                                    <span>{song.streams.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="text-blue-600 hover:underline text-sm mt-4">View All</button>
            </div>
        </div>
    );
}