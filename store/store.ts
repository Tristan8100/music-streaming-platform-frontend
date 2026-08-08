import { Song } from '@/modules/song/types';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

/* slice */
// counter default
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

// playing song
interface SongState {
  currentSong: Song | null;
  currentCover: string;
  queue: Song[];
  currentIndex: number;
  shuffledQueue: Song[];
  isShuffled: boolean;
}

const songSlice = createSlice({
  name: 'song',
  initialState: {
    currentSong: null as Song | null,
    currentCover: "",
    queue: [] as Song[],
    currentIndex: -1,
    shuffledQueue: [] as Song[],
    isShuffled: false,
  } as SongState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
    },

    clearSong: (state) => {
      state.currentSong = null;
    },

    setCurrentCover: (state, action: PayloadAction<string>) => {
      state.currentCover = action.payload;
    },

    // Set entire queue and play first song
    setQueue: (state, action: PayloadAction<Song[] | { songs: Song[]; currentSongId?: string }>) => {
      const payload = Array.isArray(action.payload) 
        ? { songs: action.payload, currentSongId: undefined }
        : action.payload;

      state.queue = payload.songs;
      
      // If currentSongId is provided, find its index; otherwise start at 0
      if (payload.currentSongId) {
        const index = payload.songs.findIndex(s => s._id === payload.currentSongId || s.id === payload.currentSongId);
        state.currentIndex = index !== -1 ? index : 0;
      } else {
        state.currentIndex = 0;
      }

      if (payload.songs.length > 0) {
        state.currentSong = payload.songs[state.currentIndex];
      }
      // Reset shuffle
      state.shuffledQueue = [];
      state.isShuffled = false;
    },

    // Play next song in queue
    playNext: (state) => {
      if (state.queue.length === 0) return;

      const finalQueue = state.isShuffled ? state.shuffledQueue : state.queue;
      const nextIndex = (state.currentIndex + 1) % finalQueue.length;
      state.currentIndex = nextIndex;
      state.currentSong = finalQueue[nextIndex];
    },

    // Play previous song in queue
    playPrevious: (state) => {
      if (state.queue.length === 0) return;

      const finalQueue = state.isShuffled ? state.shuffledQueue : state.queue;
      const prevIndex = state.currentIndex === 0 ? finalQueue.length - 1 : state.currentIndex - 1;
      state.currentIndex = prevIndex;
      state.currentSong = finalQueue[prevIndex];
    },

    // Toggle shuffle mode
    toggleShuffle: (state) => {
      if (!state.isShuffled) {
        // Enable shuffle: create randomized copy of queue
        const currentSong = state.queue[state.currentIndex];
        const filtered = state.queue.filter(song => song.id !== currentSong.id);
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        state.shuffledQueue = [currentSong, ...shuffled];
        state.currentIndex = 0;
        state.isShuffled = true;
      } else {
        // Disable shuffle: return to original queue
        const currentSong = state.currentSong;
        if (currentSong) {
          state.currentIndex = state.queue.findIndex(s => s.id === currentSong.id);
        }
        state.shuffledQueue = [];
        state.isShuffled = false;
      }
    },

    clearQueue: (state) => {
      state.queue = [];
      state.currentIndex = -1;
      state.shuffledQueue = [];
      state.isShuffled = false;
    },
  },
});

export const { 
  setCurrentSong, 
  clearSong, 
  setCurrentCover, 
  setQueue, 
  playNext, 
  playPrevious, 
  toggleShuffle, 
  clearQueue 
} = songSlice.actions;

/* store */
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    song: songSlice.reducer,
  },
});

/* types */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;