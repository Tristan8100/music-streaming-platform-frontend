'use client';
import { useParams } from "next/navigation";

export default function MyAlbums() {
    const params = useParams();

    return (
        <div>
            <h1>My Albums {params.id}</h1>
        </div>
    );
}