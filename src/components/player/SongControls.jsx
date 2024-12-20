import { useRef, useEffect, useState } from "react";
import { Slider } from "../player/Slider";
import { formatTime } from "../../utils/formatTime";

export const SongControls = ({ audioRef }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audioRef]);

  return (
    <div className="flex flex-row gap-2 items-center">
      <span className="text-xs text-gray-400 w-12 text-right">{formatTime(currentTime)}</span>
      <Slider
        defaultValue={0}
        max={duration}
        min={0}
        className="w-[400px]"
        onValueChange={(value) => {
          audioRef.current.currentTime = value;
        }}
        value={currentTime}
      />
      <span className="text-xs text-gray-400">{formatTime(duration)}</span>
    </div>
  );
}; 