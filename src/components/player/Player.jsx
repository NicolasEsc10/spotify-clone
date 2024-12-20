import { useRef, useEffect, useState } from "react";
import { usePlayerStore } from "../../store/PlayerStore";
import { Play, Pause, VolumeSilenced, VolumeLow, VolumeMedium, VolumeFull, Next, Prev } from "../../assets/icons/Icons";
import { CurrentSong } from "../player/CurrentSong";
import { SongControls } from "../player/SongControls";
import { Slider } from "../player/Slider";

export function Player() {
  const { isPlaying, setIsPlaying, currentMusic, nextSong, previousSong } = usePlayerStore(
    (state) => state
  );
  const audioRef = useRef();
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    const { song, playlist } = currentMusic;
    if (song) {
      const src = `/music/${playlist.id}/0${song.id}.mp3`;
      audioRef.current.src = src;
      audioRef.current.play();
    }
  }, [currentMusic]);

  useEffect(() => {
    const handleSongEnd = () => {
      nextSong();
    };

    const audioElement = audioRef.current;
    audioElement.addEventListener('ended', handleSongEnd);

    return () => {
      audioElement.removeEventListener('ended', handleSongEnd);
    };
  }, [nextSong]);

  const handlePlay = () => {
    if (!currentMusic.song) return;
    setIsPlaying(!isPlaying);
  };

  const onVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  return (
    <footer class="[grid-area:player] z-50">
    <div className="flex flex-row justify-between w-full px-4 z-50">
      <div className="w-[200px]">
        <CurrentSong {...currentMusic.song} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="flex justify-center gap-6 items-center">
          <button 
            className={`bg-transparent transition ${
              !currentMusic.song 
                ? "opacity-25 cursor-not-allowed hover:scale-100" 
                : "hover:scale-105 opacity-100"
            }`} 
            onClick={previousSong}
            disabled={!currentMusic.song}
          >
            <Prev className="w-4 h-4 fill-white" />
          </button>

          <button 
            className={`rounded-full p-2 transition ${
              !currentMusic.song 
                ? "bg-zinc-500 cursor-not-allowed hover:scale-100" 
                : "bg-white hover:scale-105"
            }`} 
            onClick={handlePlay}
            disabled={!currentMusic.song}
          >
            {isPlaying ? 
              <Pause className="w-4 h-4" /> : 
              <Play className="w-4 h-4" />
            }
          </button>

          <button 
            className={`bg-transparent transition ${
              !currentMusic.song 
                ? "opacity-25 cursor-not-allowed hover:scale-100" 
                : "hover:scale-105 opacity-100"
            }`}
            onClick={nextSong}
            disabled={!currentMusic.song}
          >
            <Next className="w-4 h-4 fill-white" />
          </button>
        </div>
        <SongControls audioRef={audioRef} />
      </div>

      <div className="w-[200px] flex justify-end items-center gap-3">
        <button
          className="opacity-70 hover:opacity-100 transition"
          onClick={() => {
            const audio = audioRef.current;
            if (audio.volume === 0) {
              audio.volume = 1;
              onVolumeChange(100);
            } else {
              audio.volume = 0;
              onVolumeChange(0);
            }
          }}
        >
          {volume === 0 && <VolumeSilenced />}
          {volume > 0 && volume < 33 && <VolumeLow />}
          {volume >= 33 && volume < 66 && <VolumeMedium />}
          {volume >= 66 && <VolumeFull />}
        </button>

        <Slider
          defaultValue={100}
          max={100}
          min={0}
          className="w-[100px]"
          onValueChange={(value) => {
            const newVolume = value;
            audioRef.current.volume = newVolume / 100;
            onVolumeChange(newVolume);
          }}
        />
      </div>
      <audio ref={audioRef} />
    </div>
    </footer>
  );
}
