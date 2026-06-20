// types.ts

import { Song } from "../song/types";

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


export interface AlbumDetails extends Omit<Album, "owner"> {
  owner: string;
}

export interface AlbumDetailsResponse {
  data: AlbumDetails;
  songs: Song[];
}