// types.ts

export interface Following {
  _id: string;
  name: string;
  photo_url?: string;
}

export interface ArtistFollowing {
  _id: string;
  following: Following;
}

export interface AlbumOwner {
  _id: string;
  email: string;
  name: string;
  photo_url?: string;
}

export interface Album {
  _id: string;
  title: string;
  owner: AlbumOwner;
  genre_album: string[];
  photo_local_path: string;
  photo_url: string;
  description?: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface Song {
  _id: string;
  name: string;
  plays: number;
  likes_count: number;
  song_url: string;
}