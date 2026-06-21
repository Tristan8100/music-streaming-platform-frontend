'use client';
import { Button } from "@/components/ui/button";
import { useUserAlbums } from "@/modules/albums/hook";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setCurrentSong, setCurrentCover } from '@/store/store';

export default function MyAlbums() {
    const params = useParams<{ id: string }>();

    const dispatch = useDispatch();

    const { 
        albumSongs,
        fetchOneAlbumWithSongs,
        isLoading
    } = useUserAlbums();

    useEffect(() => {
        fetchOneAlbumWithSongs(params.id);
    }, []);

    return (
        <div>
            <h1>My Albums {params.id}</h1>

            {isLoading && <p>Loading...</p>}

            {albumSongs && (
                <>
                    <div>
                        <img
                            src={albumSongs.data.photo_url}
                            alt={albumSongs.data.title}
                            width={200}
                        />

                        <h2>{albumSongs.data.title}</h2>

                        <p>{albumSongs.data.description}</p>

                        <p>
                            Genres: {albumSongs.data.genre_album.join(", ")}
                        </p>
                    </div>

                    <hr />

                    <h3>Songs</h3>

                    {albumSongs.songs.length === 0 ? (
                        <p>No songs found.</p>
                    ) : (
                        <ul>
                            {albumSongs.songs.map(song => (
                                <div key={song._id}>
                                    <h4>{song.name}</h4>

                                    <p>Plays: {song.plays}</p>

                                    <audio controls>
                                        <source
                                            src={song.song_url}
                                            type="audio/mpeg"
                                        />
                                    </audio>
                                    <Button onClick={() => { dispatch(setCurrentSong(song)), dispatch(setCurrentCover(albumSongs.data.photo_url)) }}>Play</Button>
                                </div>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}