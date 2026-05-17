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
import { api2 } from "@/lib/api"
import { useRef } from "react"
import { on } from "events"
import { AlbumsFetch } from "./types"




export interface DialogDemoProps {
    onSuccess?: () => void;
    id?: string
}

export function DialogDemo({ onSuccess, id }: DialogDemoProps) {
    const [album, setAlbum] = useState<AlbumsFetch>(
        {
            title: '',
            genre_album: [],
            description: ''
        }
    );
    const theRef = useRef<HTMLInputElement>(null);
    const [genreInput, setGenreInput] = useState("");

    useEffect(() => {
        if (id) {
            getAlbum();
        }
    }, [id]);

    const getAlbum = async () => {
        try {
            const response = await api2.get<AlbumsFetch>(`/music/albums/${id}`);
            setAlbum(response.data);
        } catch (error) {
            console.error(error);
        }
    };

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

    const saveAlbum = async () => {
      try {
        const zaFile = theRef.current?.files?.[0];
        if (!zaFile) return;

        const formData = new FormData();
        formData.append('title', album.title);
        formData.append('description', album.description || '');

        album.genre_album?.forEach((genre) => {
          formData.append('genre_album', genre);
        });

        formData.append('file', zaFile);

        const genres = formData.getAll('genre_album'); // returns an array
        console.log('genre_album:', genres);

        const response = await api2.post('/music/albums', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        onSuccess?.();
      } catch (error) {
        console.error(error);
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
          <DialogTitle>{id ? 'Edit Album' : 'Add Album'}</DialogTitle>
          <DialogDescription>
            {id ? 'Edit Album' : 'Add Album'}
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
        <Input type="file" name="file" ref={theRef} placeholder="Album Photo" />
        <DialogFooter>
            <Button onClick={saveAlbum}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}
