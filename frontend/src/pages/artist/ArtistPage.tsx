import { useArtistStore } from "@/stores/useArtistStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatArtists } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { Play, Pause, Clock } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const ArtistPage = () => {
  const { artistId } = useParams();
  const { currentArtist, isLoading, error, fetchArtistById } = useArtistStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const { fetchLibrary, toggleArtist, isArtistFollowed } = useLibraryStore();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (artistId) fetchArtistById(artistId);
  }, [artistId, fetchArtistById]);

  useEffect(() => {
    if (isSignedIn) fetchLibrary();
  }, [isSignedIn, fetchLibrary]);

  if (isLoading) return null;
  if (error || !currentArtist)
    return <div className="p-8 text-zinc-400">Artist not found.</div>;

  const songs = currentArtist.songs ?? [];
  const albums = currentArtist.albums ?? [];
  const followed = isArtistFollowed(currentArtist._id);

  const isThisArtistPlaying =
    isPlaying && songs.some((s) => s._id === currentSong?._id);

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    if (isThisArtistPlaying) togglePlay();
    else playAlbum(songs, 0);
  };

  const playSong = (index: number) => {
    const song = songs[index];
    if (currentSong?._id === song._id) togglePlay();
    else playAlbum(songs, index);
  };

  return (
    <div className="h-full rounded-md overflow-hidden">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full bg-linear-to-b from-[#3a2a5a]/80 via-zinc-900/90 to-zinc-900">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 pt-16">
            {currentArtist.imageUrl ? (
              <img
                src={currentArtist.imageUrl}
                alt={currentArtist.name}
                className="size-40 sm:size-52 rounded-full object-cover shadow-2xl"
              />
            ) : (
              <div className="size-40 sm:size-52 rounded-full bg-zinc-800 flex items-center justify-center text-6xl font-bold text-zinc-500 shadow-2xl">
                {currentArtist.name.charAt(0)}
              </div>
            )}
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium">Artist</p>
              <h1 className="text-4xl sm:text-6xl font-bold my-3">
                {currentArtist.name}
              </h1>
              <p className="text-sm text-zinc-300">
                {albums.length} {albums.length === 1 ? "album" : "albums"} •{" "}
                {songs.length} {songs.length === 1 ? "song" : "songs"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-4 flex items-center gap-6">
            <Button
              onClick={handlePlayAll}
              size="icon"
              disabled={songs.length === 0}
              className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all disabled:opacity-50"
            >
              {isThisArtistPlaying ? (
                <Pause className="h-7 w-7 text-black" />
              ) : (
                <Play className="h-7 w-7 text-black" />
              )}
            </Button>

            {isSignedIn && (
              <button
                onClick={() => toggleArtist(currentArtist._id)}
                className={cn(
                  "px-4 py-1.5 rounded-full border text-sm font-medium transition-colors",
                  followed
                    ? "border-zinc-500 text-white hover:border-white"
                    : "border-zinc-400 text-zinc-200 hover:border-white hover:text-white",
                )}
              >
                {followed ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Albums */}
          {albums.length > 0 && (
            <section className="px-6 py-4">
              <h2 className="text-2xl font-bold mb-4">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
                      {album.releaseYear}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Songs */}
          {songs.length > 0 && (
            <section className="px-6 py-4 pb-8">
              <h2 className="text-2xl font-bold mb-4">Songs</h2>
              <div className="space-y-1">
                {songs.map((song, i) => {
                  const active = currentSong?._id === song._id;
                  return (
                    <div
                      key={song._id}
                      onClick={() => playSong(i)}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/60 transition-colors group cursor-pointer"
                    >
                      <div className="relative size-12 shrink-0">
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
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate font-medium",
                            active && "text-green-500",
                          )}
                        >
                          {song.title}
                        </p>
                        <p className="text-sm text-zinc-400 truncate">
                          {formatArtists(song.artist)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-zinc-400 pr-2">
                        <Clock className="size-4" />
                        {formatDuration(song.duration)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {songs.length === 0 && albums.length === 0 && (
            <p className="px-6 py-8 text-zinc-400">
              Nothing linked to this artist yet.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArtistPage;
