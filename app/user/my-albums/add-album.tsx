'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"



export type Albums = {
    title: string,
    genre_album?: string[],
    description?: string
}

export function DialogDemo({ className }: React.HTMLAttributes<HTMLDivElement>) {
    const [album, setAlbum] = useState<Albums>(
        {
            title: '',
            genre_album: [],
            description: ''
        }
    );

    const [genreInput, setGenreInput] = useState("");

    const handleGenreKeyDown = (e : React.KeyboardEvent) => {
        if (e.key === "Enter" && genreInput.trim() !== "") {
        e.preventDefault();
        setAlbum({
            ...album,
            genre_album: [...album.genre_album!, genreInput.trim()]
        });
        setGenreInput("");
        }
    };

  return (
    <div>
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Album</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Album</DialogTitle>
          <DialogDescription>
            Add your new album
          </DialogDescription>
        </DialogHeader>
        <Input type="text" placeholder="Album Title" value={album?.title} onChange={(e) => setAlbum({...album, title: e.target.value}) } />
        <Textarea placeholder="Album Description" value={album?.description} onChange={(e) => setAlbum({...album, description: e.target.value})} />
        <Textarea placeholder="Album Genre" onKeyDown={handleGenreKeyDown} value={genreInput} onChange={(e) => setGenreInput(e.target.value)}/>
            <div className="flex">
                {album.genre_album?.map((genre, index) => (
                    <div key={index}>
                        <p className="p-2">{genre}</p>
                    </div>
                ))}
            </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button>Save</Button>
          </DialogClose>
        </DialogFooter>
        
        
      </DialogContent>
    </Dialog>
    </div>
  )
}
