'use client';
import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

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
            <h1 className="text-4xl font-bold">Manage Albums</h1>
            <p>Manage your albums</p>

            <Separator className="mt-4" />

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                { albums && albums.map((data, index) => {
                    return (
                        <Link href={`/user/my-albums/${data._id}`} key={data._id} className="bg-card w-[300px] h-[380px] rounded-xl relative">
                            <img src={data.photo_url} alt={data.title} className="object-cover rounded-xl w-full h-full shadow-lg" />
                            <div className="absolute bottom-4 left-4">
                                <h1 className="text-2xl font-bold">{data.title}</h1>
                                <p>{data.description}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
            {/* <h1>My Albums</h1>
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
            })} */}
        </>
    );
}