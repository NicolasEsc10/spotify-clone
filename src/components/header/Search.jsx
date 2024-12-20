import { useState, useEffect, useRef } from 'react';
import { allPlaylists, songs } from '@lib/data';
import { usePlayerStore } from '../../store/PlayerStore';

export function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ playlists: [], songs: [] });
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);
  const { setCurrentMusic, setIsPlaying } = usePlayerStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filteredPlaylists = [...new Set(allPlaylists
        .filter(playlist =>
          playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          playlist.artists.some(artist => 
            artist.toLowerCase().includes(searchTerm.toLowerCase())
          )
        ))];

      const uniqueSongs = [...new Map(songs
        .filter(song =>
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.artists.some(artist => 
            artist.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .map(song => [song.id, song]))
        .values()];

      setSearchResults({ 
        playlists: filteredPlaylists,
        songs: uniqueSongs
      });
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm]);

  const handleSongClick = async (song) => {
    const playlist = allPlaylists.find(p => p.albumId === song.albumId);
    if (playlist) {
      try {
        const response = await fetch(`/api/get-info-playlist.json?id=${playlist.id}`);
        const data = await response.json();
        setIsPlaying(true);
        setCurrentMusic({ 
          playlist: data.playlist,
          songs: data.songs,
          song: data.songs.find(s => s.id === song.id) || data.songs[0]
        });
      } catch (error) {
        console.error("Error al reproducir la canción:", error);
      }
    }
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="group flex items-center gap-2 bg-primary hover:bg-secondary rounded-full px-4 py-3 w-96">
        <svg
          role="img"
          aria-hidden="true"
          className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z"></path>
        </svg>
        <input 
          type="text" 
          placeholder="¿Qué quieres reproducir?" 
          className="bg-transparent border-none focus:outline-none w-full text-white placeholder:text-zinc-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length > 1 && setShowResults(true)}
        />
      </div>

      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 rounded-lg p-4 shadow-xl z-50">
          {searchResults.playlists.length > 0 && (
            <div className="mb-4">
              <h3 className="text-white text-sm font-bold mb-2">Playlists</h3>
              <div className="space-y-2">
                {searchResults.playlists.slice(0, 4).map((playlist) => (
                  <a 
                    key={playlist.id}
                    href={`/playlist/${playlist.id}`}
                    className="flex items-center gap-3 hover:bg-zinc-800 p-2 rounded-md transition-colors"
                  >
                    <img 
                      src={playlist.cover} 
                      alt={playlist.title} 
                      className="w-10 h-10 rounded-md"
                    />
                    <div>
                      <h4 className="text-white text-sm">{playlist.title}</h4>
                      <p className="text-zinc-400 text-xs">
                        {playlist.artists.join(', ')}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {searchResults.songs.length > 0 && (
            <div>
              <h3 className="text-white text-sm font-bold mb-2">Canciones</h3>
              <div className="space-y-2">
                {searchResults.songs.slice(0, 4).map((song) => (
                  <button 
                    key={song.id}
                    className="flex items-center gap-3 hover:bg-zinc-800 p-2 rounded-md transition-colors w-full text-left"
                    onClick={() => handleSongClick(song)}
                  >
                    <img 
                      src={song.image} 
                      alt={song.title} 
                      className="w-10 h-10 rounded-md"
                    />
                    <div>
                      <h4 className="text-white text-sm">{song.title}</h4>
                      <p className="text-zinc-400 text-xs">
                        {song.artists.join(', ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.playlists.length === 0 && searchResults.songs.length === 0 && (
            <p className="text-zinc-400 text-sm">No se encontraron resultados para "{searchTerm}"</p>
          )}
        </div>
      )}
    </div>
  );
}