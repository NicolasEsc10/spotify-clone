import { usePlayerStore } from "../../store/PlayerStore";

export const CurrentSong = ({ image, title, artists }) => {
  if (!image && !title) return null;

  return (
    <div className="flex items-center gap-5 relative overflow-hidden min-w-[180px]">
      <picture className="w-16 h-16 bg-zinc-800 rounded-md shadow-lg overflow-hidden flex-none">
        <img src={image} alt={`Portada de ${title}`} className="object-cover w-full h-full" />
      </picture>

      <div className="flex flex-col flex-1 truncate">
        <a 
          href="#" 
          className="font-bold block text-white hover:underline cursor-pointer truncate"
          title={title}
          aria-label={`Ir a la canción ${title}`}
        >
          {title}
        </a>
        <a 
          href="#"
          className="text-xs text-gray-400 hover:underline truncate"
          title={artists?.join(", ")}
          aria-label={`Ir a los artistas ${artists?.join(", ")}`}
        >
          {artists?.join(", ")}
        </a>
      </div>
    </div>
  );
}; 