import { api2 } from "@/lib/api";
import { useState } from "react";

export default function useSong() {
  const [name, setName] = useState("");
  const [genres, setGenres] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (albumId: string) => {
    if (!name || !file) {
      alert("Song name and file are required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append(
        "genre_song",
        JSON.stringify(
          genres
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean)
        )
      );
      formData.append("file", file);

      await api2.post(`/music/songs/${albumId}`, formData);

      setName("");
      setGenres("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to create song.");
    } finally {
      setLoading(false);
    }
  };

  const editSong = async (songId: string) => {
    try {
      setLoading(true);

      await api2.put(`/music/songs/${songId}`, {
        name,
        genre_song: genres
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean),
        });
    } catch (err) {
      console.error(err);
      alert("Failed to update song.");
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    genres,
    setGenres,
    file,
    setFile,
    loading,
    handleSubmit,
    editSong,
  };
}