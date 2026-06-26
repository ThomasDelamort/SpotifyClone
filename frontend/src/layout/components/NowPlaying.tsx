import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { formatArtists } from "@/lib/utils";
import { Disc3, Music2 } from "lucide-react";

// Animated equalizer bars shown while a song is playing.
const Equalizer = () => (
  <div className="flex items-end gap-[3px] h-4" aria-hidden="true">
    {[0, 1, 2, 3].map((i) => (
      <span
        key={i}
        className="np-bar w-[3px] rounded-full bg-emerald-400"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const NowPlaying = () => {
  const { currentSong, isPlaying, queue, currentIndex, setCurrentSong } =
    usePlayerStore();

  const upNext = currentIndex >= 0 ? queue.slice(currentIndex + 1) : [];

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      {/* keyframes kept local so the component is self-contained; reduced-motion freezes them */}
      <style>{`
                @keyframes np-eq { 0%,100% { height: 25%; } 50% { height: 100%; } }
                .np-bar { height: 40%; animation: np-eq 0.9s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) { .np-bar { animation: none; height: 60%; } }
            `}</style>

      <div className="p-4 flex items-center gap-2 border-b border-zinc-800">
        <Disc3 className="size-5 shrink-0" />
        <h2 className="font-semibold">Now playing</h2>
      </div>

      {!currentSong ? (
        <EmptyState />
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Album art with an ambient glow — the panel's signature element */}
            <div className="relative">
              <div
                className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-emerald-500/40 to-sky-500/30 blur-2xl opacity-70"
                aria-hidden="true"
              />
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="relative w-full aspect-square object-cover rounded-xl shadow-xl"
              />
            </div>

            {/* Title + artists + playing indicator */}
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {currentSong.title}
                </h3>
                {isPlaying && <Equalizer />}
              </div>
              <p className="text-sm text-zinc-400 truncate">
                {formatArtists(currentSong.artist)}
              </p>
            </div>

            {/* Up next */}
            {upNext.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Next in queue
                </h4>
                <div className="space-y-1">
                  {upNext.map((song) => (
                    <button
                      key={song._id}
                      onClick={() => setCurrentSong(song)}
                      className="w-full flex items-center gap-3 p-2 rounded-md text-left
                                                hover:bg-zinc-800/60 transition-colors group"
                    >
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="size-10 rounded object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">
                          {song.title}
                        </div>
                        <div className="text-xs text-zinc-400 truncate">
                          {formatArtists(song.artist)}
                        </div>
                      </div>
                      <Music2
                        className="size-4 text-emerald-400 opacity-0 group-hover:opacity-100
                                                    transition-opacity shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default NowPlaying;

const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
    <div className="relative">
      <div
        className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg opacity-60"
        aria-hidden="true"
      />
      <div className="relative bg-zinc-900 rounded-full p-4">
        <Music2 className="size-8 text-emerald-400" />
      </div>
    </div>
    <div className="space-y-2 max-w-[220px]">
      <h3 className="text-lg font-semibold text-white">Nothing playing</h3>
      <p className="text-sm text-zinc-400">
        Pick a song and it'll show up here.
      </p>
    </div>
  </div>
);
