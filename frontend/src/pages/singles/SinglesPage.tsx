import TopBar from "@/components/TopBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/audio";
import { cn, formatArtists } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Music2, Pause, Play, Shuffle } from "lucide-react";
import { useEffect } from "react";

// Singles are tracks published on their own — they have no album record, so the
// song's own artwork is the release cover. Playing one queues every single, so
// the page behaves like any other collection in the app.
const SinglesPage = () => {
  const { singles, fetchSingles, isLoading } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay, toggleShuffle, isShuffled } =
    usePlayerStore();

  useEffect(() => {
    fetchSingles();
  }, [fetchSingles]);

  const isPlayingFromHere =
    isPlaying && singles.some((song) => song._id === currentSong?._id);

  const playSingle = (index: number) => {
    const song = singles[index];
    if (currentSong?._id === song._id) togglePlay();
    else playAlbum(singles, index);
  };

  const handlePlayAll = () => {
    if (singles.length === 0) return;
    if (isPlayingFromHere) togglePlay();
    else playAlbum(singles, 0);
  };

  const handleShuffle = () => {
    if (singles.length === 0) return;
    if (!isShuffled) toggleShuffle();
    playAlbum(singles, Math.floor(Math.random() * singles.length));
  };

  return (
    <div className="rounded-md overflow-hidden h-full bg-linear-to-b from-zinc-800 to-zinc-900">
      <TopBar />

      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-300">Collection</p>
              <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-3">Singles</h1>
              <p className="text-sm text-zinc-400">
                {singles.length} {singles.length === 1 ? "release" : "releases"} — tracks
                published on their own, outside an album
              </p>
            </div>

            {singles.length > 0 && (
              <div className="flex items-center gap-5">
                <Button
                  onClick={handlePlayAll}
                  size="icon"
                  className="size-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
                  aria-label={isPlayingFromHere ? "Pause" : "Play all singles"}
                >
                  {isPlayingFromHere ? (
                    <Pause className="size-7 text-black" />
                  ) : (
                    <Play className="size-7 text-black" />
                  )}
                </Button>

                <button
                  onClick={handleShuffle}
                  aria-label="Shuffle singles"
                  title="Shuffle"
                  className={cn(
                    "transition-colors",
                    isShuffled ? "text-green-500" : "text-zinc-400 hover:text-white",
                  )}
                >
                  <Shuffle className="size-6" />
                </button>
              </div>
            )}
          </div>

          {isLoading && singles.length === 0 ? (
            <p className="text-zinc-400">Loading singles...</p>
          ) : singles.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center text-zinc-400">
              <Music2 className="size-8 text-zinc-500" />
              <p>No singles yet.</p>
              <p className="text-sm text-zinc-500">
                A release with exactly one track is published here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {singles.map((song, index) => {
                const active = currentSong?._id === song._id;

                return (
                  <div
                    key={song._id}
                    onClick={() => playSingle(index)}
                    className="group relative bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-md overflow-hidden mb-4 shadow-lg">
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        size="icon"
                        aria-label={active && isPlaying ? "Pause" : `Play ${song.title}`}
                        className={cn(
                          "absolute bottom-2 right-2 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all",
                          active
                            ? "opacity-100"
                            : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
                        )}
                      >
                        {active && isPlaying ? (
                          <Pause className="size-4 text-black" />
                        ) : (
                          <Play className="size-4 text-black" />
                        )}
                      </Button>
                    </div>

                    <h3
                      className={cn(
                        "font-medium truncate",
                        active && "text-green-500",
                      )}
                    >
                      {song.title}
                    </h3>
                    <p className="text-sm text-zinc-400 truncate">
                      {formatArtists(song.artist)}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Single{song.duration ? ` · ${formatDuration(song.duration)}` : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SinglesPage;
