// types.ts

export interface User {
  _id: string;
  email: string;
  name: string;
  photo_url: string;
}

export interface Album {
  _id: string;
  title: string;
  owner: User;
  genre_album: string[];
  photo_local_path: string;
  photo_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type AlbumsFetch = {
    title: string,
    genre_album?: string[],
    description?: string
}

//newly added
export interface Song {
  _id: string;
  name: string;
  album_id: string;
  user_id: string;
  genre_song: string[];
  plays: number;
  likes_count: number;
  song_local_path: string;
  song_url: string;
  created_at: string;
  updated_at: string;
}

export interface AlbumDetails extends Omit<Album, "owner"> {
  owner: string;
}

export interface AlbumDetailsResponse {
  data: AlbumDetails;
  songs: Song[];
}