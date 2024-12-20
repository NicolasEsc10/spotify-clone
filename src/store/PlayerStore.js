import { create } from "zustand";

export const usePlayerStore = create((set, get) => ({
  isPlaying: false,
  currentMusic: { playlist: null, song: null, songs: [] },
  volume: 1,
  setVolume: (volume) => set({ volume }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentMusic: (currentMusic) => set({ currentMusic }),

  nextSong: () => {
    const { currentMusic } = get()
    const { songs, song } = currentMusic
    if (!song || !songs.length) return

    const currentIndex = songs.findIndex(s => s.id === song.id)
    const nextSong = songs[currentIndex + 1]

    if (nextSong) {
      set({ 
        currentMusic: { ...currentMusic, song: nextSong }
      })
    }
  },

  previousSong: () => {
    const { currentMusic } = get()
    const { songs, song } = currentMusic
    if (!song || !songs.length) return

    const currentIndex = songs.findIndex(s => s.id === song.id)
    const previousSong = songs[currentIndex - 1]

    if (previousSong) {
      set({ 
        currentMusic: { ...currentMusic, song: previousSong }
      })
    }
  }
}));
