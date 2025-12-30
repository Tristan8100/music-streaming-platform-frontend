"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Disc3, Users } from "lucide-react"

interface Artist {
  id: string
  name: string
  image: string
  genre: string
  followers: number
}

interface Song {
  id: string
  title: string
  artist: string
  duration: string
  plays: number
}

interface Album {
  id: string
  title: string
  artist: string
  image: string
  releaseYear: number
  tracks: number
}

export default function TabsListComponent() {
  const [artists] = useState<Artist[]>([
    {
      id: "1",
      name: "The Weeknd",
      image: "/the-weeknd-artist-profile.jpg",
      genre: "Pop/R&B",
      followers: 95000000,
    },
    {
      id: "2",
      name: "Bad Bunny",
      image: "/bad-bunny-reggaeton-artist.jpg",
      genre: "Reggaeton",
      followers: 85000000,
    },
    {
      id: "3",
      name: "Taylor Swift",
      image: "/taylor-swift-artist-profile.jpg",
      genre: "Pop",
      followers: 92000000,
    },
  ])

  const [songs] = useState<Song[]>([
    { id: "1", title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", plays: 4200000000 },
    { id: "2", title: "As It Was", artist: "Harry Styles", duration: "2:32", plays: 2800000000 },
    { id: "3", title: "Levitating", artist: "Dua Lipa", duration: "3:23", plays: 3100000000 },
    { id: "4", title: "Anti-Hero", artist: "Taylor Swift", duration: "3:20", plays: 1800000000 },
  ])

  const [albums] = useState<Album[]>([
    {
      id: "1",
      title: "After Hours",
      artist: "The Weeknd",
      image: "/after-hours-album-cover.jpg",
      releaseYear: 2020,
      tracks: 14,
    },
    {
      id: "2",
      title: "Midnights",
      artist: "Taylor Swift",
      image: "/midnights-album-taylor-swift.jpg",
      releaseYear: 2022,
      tracks: 13,
    },
    {
      id: "3",
      title: "Eternal Atake",
      artist: "Lil Uzi Vert",
      image: "/eternal-atake-album-art.jpg",
      releaseYear: 2020,
      tracks: 16,
    },
  ])

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="songs" className="gap-2 data-[state=active]:bg-background">
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">Songs</span>
          </TabsTrigger>
          <TabsTrigger value="artists" className="gap-2 data-[state=active]:bg-background">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Artists</span>
          </TabsTrigger>
          <TabsTrigger value="albums" className="gap-2 data-[state=active]:bg-background">
            <Disc3 className="w-4 h-4" />
            <span className="hidden sm:inline">Albums</span>
          </TabsTrigger>
        </TabsList>

        {/* Songs Tab */}
        <TabsContent value="songs" className="mt-6 space-y-3">
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {song.title}
                </h3>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </div>
              <div className="flex items-center gap-4 ml-4 text-sm text-muted-foreground">
                <span>{song.duration}</span>
                <span className="hidden sm:inline">{(song.plays / 1000000000).toFixed(1)}B plays</span>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Artists Tab */}
        <TabsContent value="artists" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer group text-center"
              >
                <div className="mb-4 overflow-hidden rounded-lg">
                  <img
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                  {artist.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{artist.genre}</p>
                <p className="text-xs text-muted-foreground">{(artist.followers / 1000000).toFixed(0)}M followers</p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Albums Tab */}
        <TabsContent value="albums" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
              >
                <div className="overflow-hidden bg-muted">
                  <img
                    src={album.image || "/placeholder.svg"}
                    alt={album.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{album.artist}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{album.releaseYear}</span>
                    <span>{album.tracks} tracks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
