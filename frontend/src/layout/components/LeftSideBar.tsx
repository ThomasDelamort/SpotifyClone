import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils.ts";
import { useLibraryStore } from "@/stores/useLibraryStore.ts";
import {
  HomeIcon,
  Library,
  Search,
  Plus,
  ArrowDownUp,
  X,
  Music2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button.tsx";
import { useEffect, useMemo, useState } from "react";
import PlaylistSkeleton from "@/components/skeleton/PlaylistSkeleton.tsx";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import type { Album, Artist } from "@/types";

type Filter = "all" | "playlists" | "artists" | "albums";
type Sort = "recents" | "az";

interface LibItem {
  type: "album" | "artist";
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  to?: string;
}

export const LeftSideBar = () => {
  const { albums, artists, isLoading, fetchLibrary } = useLibraryStore();
  const { isSignedIn, isLoaded } = useUser();
  const { pathname } = useLocation();

  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recents");
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (isSignedIn) fetchLibrary();
  }, [fetchLibrary, isSignedIn]);

  const items = useMemo<LibItem[]>(() => {
    const albumItems: LibItem[] = albums.map((a: Album) => ({
      type: "album",
      id: a._id,
      title: a.title,
      subtitle: `Album • ${a.artist}`,
      imageUrl: a.imageUrl,
      to: `/albums/${a._id}`,
    }));
    const artistItems: LibItem[] = artists.map((a: Artist) => ({
      type: "artist",
      id: a._id,
      title: a.name,
      subtitle: "Artist",
      imageUrl: a.imageUrl,
      to: `/artists/${a._id}`,
    }));

    let list: LibItem[];
    if (filter === "albums") list = albumItems;
    else if (filter === "artists") list = artistItems;
    else if (filter === "playlists") list = [];
    else list = [...albumItems, ...artistItems];

    const q = query.trim().toLowerCase();
    if (q)
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle.toLowerCase().includes(q),
      );

    if (sort === "az")
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else list = [...list].reverse(); // recents ≈ most-recently-saved first

    return list;
  }, [albums, artists, filter, sort, query]);

  const pills: { key: Filter; label: string }[] = [
    { key: "playlists", label: "Playlists" },
    { key: "artists", label: "Artists" },
    { key: "albums", label: "Albums" },
  ];

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Nav */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <NavLink
            to="/"
            icon={<HomeIcon className="mr-2 size-5" />}
            label="Home"
          />
          <NavLink
            to="/search"
            icon={<Search className="mr-2 size-5" />}
            label="Search"
          />
        </div>
      </div>

      {/* Library */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-white px-2">
            <Library className="size-5 mr-2" />
            <span className="hidden md:inline font-semibold">Your Library</span>
          </div>
          <button
            title="Create playlist (coming soon)"
            className="hidden md:inline-flex text-zinc-400 hover:text-white transition-colors p-1 rounded-full"
            aria-label="Create playlist"
          >
            <Plus className="size-5" />
          </button>
        </div>

        {/* Filter pills */}
        <div className="hidden md:flex gap-2 mb-3 overflow-x-auto no-scrollbar">
          {pills.map((p) => {
            const active = filter === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setFilter(active ? "all" : p.key)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-sm transition-colors",
                  active
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-white hover:bg-zinc-700",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Search + sort controls */}
        <div className="hidden md:flex items-center justify-between mb-2 px-1 gap-2">
          {showSearch ? (
            <div className="flex-1 flex items-center gap-1 bg-zinc-800 rounded-md px-2">
              <Search className="size-4 text-zinc-400 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search in Your Library"
                className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-zinc-500"
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setQuery("");
                }}
                className="text-zinc-400 hover:text-white shrink-0"
                aria-label="Close search"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="text-zinc-400 hover:text-white transition-colors p-1"
              aria-label="Search your library"
            >
              <Search className="size-4" />
            </button>
          )}

          {!showSearch && (
            <button
              onClick={() => setSort(sort === "recents" ? "az" : "recents")}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
              title="Change sort order"
            >
              <span>{sort === "recents" ? "Recents" : "A–Z"}</span>
              <ArrowDownUp className="size-4" />
            </button>
          )}
        </div>

        {/* List */}
        <ScrollArea className="flex-1 min-h-0">
          {!isLoaded ? null : !isSignedIn ? (
            <LoginPrompt />
          ) : isLoading ? (
            <PlaylistSkeleton />
          ) : items.length === 0 ? (
            <EmptyState filter={filter} hasQuery={query.trim().length > 0} />
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <Row
                  key={`${item.type}-${item.id}`}
                  item={item}
                  active={item.to === pathname}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSideBar;

const NavLink = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Link
    to={to}
    className={cn(
      buttonVariants({ variant: "ghost" }),
      "w-full justify-start text-white hover:bg-zinc-800 rounded-sm",
    )}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </Link>
);

const Row = ({ item, active }: { item: LibItem; active: boolean }) => {
  const inner = (
    <>
      <img
        src={item.imageUrl}
        alt={item.title}
        className={cn(
          "size-12 shrink-0 object-cover",
          item.type === "artist" ? "rounded-full" : "rounded-md",
        )}
      />
      <div className="flex-1 min-w-0 hidden md:block">
        <p className="font-medium truncate">{item.title}</p>
        <p className="text-sm text-zinc-400 truncate">{item.subtitle}</p>
      </div>
    </>
  );

  const base = "p-2 rounded-md flex items-center gap-3 group";

  // Albums link to their page; artists have no page yet (Phase 3), so render inert.
  if (item.to) {
    return (
      <Link
        to={item.to}
        className={cn(
          base,
          "hover:bg-zinc-800 cursor-pointer",
          active && "bg-zinc-800",
        )}
      >
        {inner}
      </Link>
    );
  }
  return (
    <div
      className={cn(base, "cursor-default")}
      title="Artist pages coming soon"
    >
      {inner}
    </div>
  );
};

const EmptyState = ({
  filter,
  hasQuery,
}: {
  filter: Filter;
  hasQuery: boolean;
}) => {
  let msg = "Your library is empty. Save an album to get started.";
  if (hasQuery) msg = "No results in your library.";
  else if (filter === "albums") msg = "Albums you save show up here.";
  else if (filter === "artists") msg = "Artists you follow show up here.";
  else if (filter === "playlists") msg = "Playlists you create show up here.";

  return (
    <div className="hidden md:flex flex-col items-center text-center text-sm text-zinc-400 px-4 py-10 gap-2">
      <Music2 className="size-6 text-zinc-500" />
      <p>{msg}</p>
    </div>
  );
};

const LoginPrompt = () => (
  <div className="hidden md:flex flex-col items-center text-center text-sm text-zinc-400 px-4 py-10 gap-2">
    <Library className="size-6 text-zinc-500" />
    <p>Log in to build your library and save albums.</p>
  </div>
);
