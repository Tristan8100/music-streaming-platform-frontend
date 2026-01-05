'use client';
import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export interface User {
  _id: string
  email: string
  name: string
  photo_url: string
}

export interface Album {
  _id: string
  title: string
  owner: User
  genre_album: string[]
  photo_local_path: string
  photo_url: string
  description: string
  created_at: string
  updated_at: string
}


export default function MyAlbumsPage() {
    const [albums, setAlbums] = useState<Album[] | []>([]);

    const fetchAlbums = async () => {
        const response = await api2.get<Album[]>('/music/albums-user');
        setAlbums(response.data);
    }

    useEffect(() => {
        fetchAlbums();
        console.log(albums);
    }, []);

    if(!albums) return 
        <>
            <h1>My Albums</h1>
            <p>Loading...</p>
        </>
    ;

    return (
        <>
            <h1>My Albums</h1>
            { albums && albums.map((alb) => {
                return (
                    <Card key={alb._id}>
                        <CardHeader>{alb.title}</CardHeader>
                        <CardContent>
                            {alb.description}
                            <img src={alb.photo_url} alt={alb.title} />
                        </CardContent>
                        <Link href="">View</Link>
                    </Card>
                )
            })}
        </>
    );
}