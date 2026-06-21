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
const songSlice = createSlice({
  name: 'song',
  initialState: { currentSong: null as Song | null, currentCover: "" },
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
  },
});

export const { setCurrentSong, clearSong, setCurrentCover } = songSlice.actions;

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