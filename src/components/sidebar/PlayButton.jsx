import { Play, Pause } from "@/src/assets/icons/Icons";
import { usePlayerStore } from "../../store/PlayerStore";

export function PlayButton({ id, className }) {
  const { currentMusic, isPlaying, setIsPlaying, setCurrentMusic } =
    usePlayerStore((state) => state);

  const isPlayingPlaylist = isPlaying && currentMusic?.playlist?.id === id;

  const handleClick = (e) => {
    e.preventDefault();
    
    if (isPlayingPlaylist) {
      setIsPlaying(false);
      return;
    }

    fetch(`/api/get-info-playlist.json?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const { playlist, songs } = data;
        setIsPlaying(true);
        setCurrentMusic({ playlist, songs, song: songs[0] });
      });
  };

  return (
    <button onClick={handleClick}>
      {isPlayingPlaylist ? 
        <Pause className={className} /> : 
        <Play className={className} />
      }
    </button>
  );
} 