import { Play, Pause } from "@icons/Icons";
import { usePlayerStore } from "../../store/PlayerStore";

export function PlayButtonSong({ song, songs, playlist }) {
  const { currentMusic, isPlaying, setIsPlaying, setCurrentMusic } = usePlayerStore(state => state);

  const isPlayingThisSong = isPlaying && currentMusic?.song?.id === song.id;

  const handleClick = () => {
    if (isPlayingThisSong) {
      setIsPlaying(false);
      return;
    }

    // Encontrar el índice de la canción actual
    const songIndex = songs.findIndex((s) => s.id === song.id);
    
    setIsPlaying(true);
    setCurrentMusic({ 
      playlist,
      songs,
      song: songs[songIndex]
    });
  };

  return (
    <button 
      onClick={handleClick}
      className="text-white hover:text-green-400 transition duration-300"
    >
      {isPlayingThisSong ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
    </button>
  );
} 