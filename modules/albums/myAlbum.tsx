// page.tsx
'use client';

import { useUserAlbums } from "./hook";
import { Separator } from "@/components/ui/separator";
import { DialogDemo } from "./add-album";
import Link from "next/link";
import { Album } from "./types";

export default function MyAlbumsPage() {
  const { albums, isLoading, refreshAlbums } = useUserAlbums();

  if (isLoading) {
    return (
      <>
        <h1 className="text-4xl font-bold">My Albums</h1>
        <p className="mt-2 text-gray-500">Loading...</p>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Manage Albums</h1>
          <p className="text-gray-500">Manage your albums</p>
        </div>

        <DialogDemo onSuccess={refreshAlbums} />
      </div>

      <Separator className="mt-4" />

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {albums.map((album) => (
          <AlbumGridItem
            key={album._id}
            album={album}
            refreshAlbums={refreshAlbums}
          />
        ))}
      </div>
    </>
  );
}

interface AlbumGridItemProps {
  album: Album;
  refreshAlbums: () => void;
}

function AlbumGridItem({
  album,
  refreshAlbums,
}: AlbumGridItemProps) {
  return (
    <div className="relative w-[300px] h-[380px] group">

      {/* Edit Dialog Button */}
      <div className="absolute top-3 right-3 z-10">
        <DialogDemo
          id={album._id}
          onSuccess={refreshAlbums}
        />
      </div>

      {/* Clickable Album Card */}
      <Link
        href={`/user/my-albums/${album._id}`}
        className="bg-card rounded-xl block overflow-hidden w-full h-full"
      >
        <img
          src={album.photo_url}
          alt={album.title}
          className="object-cover rounded-xl w-full h-full shadow-lg transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute bottom-4 left-4 right-4 bg-black/40 p-3 rounded-lg backdrop-blur-xs text-white">
          <h2 className="text-2xl font-bold truncate">
            {album.title}
          </h2>

          <p className="text-sm opacity-90 truncate">
            {album.description}
          </p>
        </div>
      </Link>
    </div>
  );
}