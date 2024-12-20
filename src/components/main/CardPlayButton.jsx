import { Play, Pause } from "@/src/assets/icons/Icons";
import { usePlayerStore } from "../../store/PlayerStore";

export function CardPlayButton({ id, size = "small" }) {
  const { currentMusic, isPlaying, setIsPlaying, setCurrentMusic } =
    usePlayerStore((state) => state);

  const isPlayingPlaylist = isPlaying && currentMusic?.playlist?.id === id;

  const handleClick = () => {
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

        console.log({playlist, songs});
      });
  };

  const sizeClass = size === "small" ? "w-6 h-6" : "w-8 h-8";

  return (
    <button
      className="bg-green-500 hover:bg-green-600 transition-all duration-300 card-play-button rounded-full p-4 hover:scale-105"
      onClick={handleClick}
    >
      {isPlayingPlaylist ? <Pause className={sizeClass} /> : <Play className={sizeClass} />}
    </button>
  );
}
