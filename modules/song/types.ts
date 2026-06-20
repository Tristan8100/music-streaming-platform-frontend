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