"use client";

import { useEffect, useState } from "react";
import useSong from "./songHook";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Song } from "./types";

interface EditSongDialogProps {
  song: Song;
  onSuccess: () => void;
}

export default function EditSongDialog({
  song,
  onSuccess,
}: EditSongDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    name,
    setName,
    genres,
    setGenres,
    loading,
    editSong,
  } = useSong();

  useEffect(() => {
    if (open) {
      setName(song.name);
      setGenres(song.genre_song.join(", "));
    }
  }, [open, song, setName, setGenres]);

  const handleUpdate = async () => {
    await editSong(song._id);

    setOpen(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Song</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Song Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Genres</Label>
            <Input
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="Pop, Rock"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={loading}
            onClick={handleUpdate}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}