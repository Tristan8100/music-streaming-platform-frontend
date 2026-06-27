"use client";

import { useState } from "react";
import { api2 } from '@/lib/api';

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
import useSong from "./songHook";

interface CreateSongDialogProps {
  albumId: string;
  onSuccess: () => void;
}

export default function CreateSongDialog({
  albumId,
  onSuccess,
}: CreateSongDialogProps) {
  const [open, setOpen] = useState(false);

  const { name, setName, genres, setGenres, file, setFile, handleSubmit, loading } = useSong();

  const createSong = async () => {
    try{
      await handleSubmit(albumId);
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Song</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Song</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Song Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Song name"
            />
          </div>

          <div>
            <Label>Genres</Label>
            <Input
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="Pop, Rock, Jazz"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate multiple genres with commas.
            </p>
          </div>

          <div>
            <Label>Audio File</Label>
            <Input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={createSong}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}