import TopBar from "@/components/TopBar.tsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatArtists } from "@/lib/utils";
import { useSearchStore } from "@/stores/useSearchStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const SearchPage = () => {
    const { query, search, results, isLoading } = useSearchStore();
    const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

    // debounce: fire the search 300ms after the last keystroke (driven by the TopBar input)
    useEffect(() => {
        const t = setTimeout(() => search(query), 300);
        return () => clearTimeout(t);
    }, [query, search]);

    const playSong = (index: number) => {
        const song = results.songs[index];
        if (currentSong?._id === song._id) togglePlay();
        else playAlbum(results.songs, index); // queue = current search results
    };

    const hasQuery = query.trim().length > 0;
    const { songs, albums, artists } = results;
    const noResults =
        hasQuery && !isLoading && songs.length === 0 && albums.length === 0 && artists.length === 0;

    return (
        <div className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
            <TopBar />
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-4 sm:p-6">
                    {!hasQuery && (
                        <p className="text-zinc-400">Search for songs, artists, and albums.</p>
                    )}

                    {isLoading && <p className="text-zinc-400">Searching…</p>}

                    {noResults && (
                        <p className="text-zinc-400">
                            No results for <span className="text-white font-medium">"{query}"</span>.
                        </p>
                    )}

                    {/* Songs */}
                    {songs.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4">Songs</h2>
                            <div className="space-y-1">
                                {songs.map((song, i) => {
                                    const active = currentSong?._id === song._id;
                                    return (
                                        <div
                                            key={song._id}
                                            onClick={() => playSong(i)}
                                            className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/60 transition-colors group cursor-pointer"
                                        >
                                            <div className="relative size-12 flex-shrink-0">
                                                <img
                                                    src={song.imageUrl}
                                                    alt={song.title}
                                                    className="size-12 rounded object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center rounded bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {active && isPlaying ? (
                                                        <Pause className="size-5 text-white" />
                                                    ) : (
                                                        <Play className="size-5 text-white" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`truncate font-medium ${active ? "text-green-500" : ""}`}>
                                                    {song.title}
                                                </p>
                                                <p className="text-sm text-zinc-400 truncate">
                                                    {formatArtists(song.artist)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Artists */}
                    {artists.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4">Artists</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                {artists.map((artist) => (
                                    <div
                                        key={artist._id}
                                        className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all"
                                    >
                                        {artist.imageUrl ? (
                                            <img
                                                src={artist.imageUrl}
                                                alt={artist.name}
                                                className="aspect-square w-full rounded-full object-cover mb-3"
                                            />
                                        ) : (
                                            <div className="aspect-square w-full rounded-full mb-3 bg-zinc-700 flex items-center justify-center text-2xl font-bold text-zinc-400">
                                                {artist.name.charAt(0)}
                                            </div>
                                        )}
                                        <p className="font-medium truncate text-center">{artist.name}</p>
                                        <p className="text-xs text-zinc-400 text-center">Artist</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Albums */}
                    {albums.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4">Albums</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {albums.map((album) => (
                                    <Link
                                        to={`/albums/${album._id}`}
                                        key={album._id}
                                        className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group"
                                    >
                                        <div className="aspect-square rounded-md overflow-hidden mb-4 shadow-lg">
                                            <img
                                                src={album.imageUrl}
                                                alt={album.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <h3 className="font-medium truncate">{album.title}</h3>
                                        <p className="text-sm text-zinc-400 truncate">
                                            {album.releaseYear} • {album.artist}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default SearchPage;