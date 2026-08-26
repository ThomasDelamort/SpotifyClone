import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn, formatArtists } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Disc3, Music, Music2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// The catalogue stores the two release kinds in different places: albums are
// Album records, singles are Songs with no albumId. This table merges both into
// one list so the admin sees everything they have published in one place.

type Filter = "all" | "album" | "single";

interface ReleaseRow {
  kind: "album" | "single";
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  trackCount: number;
  detail: string;
  to: string;
}

const ReleasesTable = () => {
  const { albums, singles, deleteAlbum, deleteSong } = useMusicStore();
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo<ReleaseRow[]>(() => {
    const albumRows: ReleaseRow[] = albums.map((album) => ({
      kind: "album",
      id: album._id,
      title: album.title,
      artist: album.artist,
      imageUrl: album.imageUrl,
      trackCount: album.songs?.length ?? 0,
      detail: `${album.releaseYear}`,
      to: `/albums/${album._id}`,
    }));

    const singleRows: ReleaseRow[] = singles.map((song) => ({
      kind: "single",
      id: song._id,
      title: song.title,
      artist: formatArtists(song.artist),
      imageUrl: song.imageUrl,
      trackCount: 1,
      detail: song.createdAt?.split("T")[0] ?? "",
      to: "/singles",
    }));

    const all = [...albumRows, ...singleRows];
    const visible = filter === "all" ? all : all.filter((row) => row.kind === filter);

    // Album has no createdAt, but a Mongo ObjectId is time-ordered, so sorting
    // on the id descending puts the newest releases of both kinds first.
    return visible.sort((a, b) => b.id.localeCompare(a.id));
  }, [albums, singles, filter]);

  const pills: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: albums.length + singles.length },
    { key: "album", label: "Albums", count: albums.length },
    { key: "single", label: "Singles", count: singles.length },
  ];

  const handleDelete = (row: ReleaseRow) =>
    row.kind === "album" ? deleteAlbum(row.id) : deleteSong(row.id);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {pills.map((pill) => (
          <button
            key={pill.key}
            onClick={() => setFilter(pill.key)}
            className={cn(
              "rounded-full px-3 py-1 text-sm transition-colors",
              filter === pill.key
                ? "bg-white text-black"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
            )}
          >
            {pill.label} ({pill.count})
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-700 px-4 py-10 text-center text-sm text-zinc-500">
          Nothing here yet. Use “New Release” to publish an album or a single.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-zinc-800/50">
              <TableHead className="w-12.5"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Released</TableHead>
              <TableHead>Tracks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${row.kind}-${row.id}`} className="hover:bg-zinc-800/50">
                <TableCell>
                  <img
                    src={row.imageUrl}
                    alt={row.title}
                    className="size-10 rounded object-cover"
                  />
                </TableCell>

                <TableCell className="font-medium">
                  <Link to={row.to} className="hover:underline">
                    {row.title}
                  </Link>
                </TableCell>

                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      row.kind === "album"
                        ? "bg-violet-500/10 text-violet-400"
                        : "bg-emerald-500/10 text-emerald-400",
                    )}
                  >
                    {row.kind === "album" ? (
                      <Disc3 className="size-3" />
                    ) : (
                      <Music2 className="size-3" />
                    )}
                    {row.kind === "album" ? "Album" : "Single"}
                  </span>
                </TableCell>

                <TableCell>{row.artist}</TableCell>

                <TableCell>
                  <span className="inline-flex items-center gap-1 text-zinc-400">
                    <Calendar className="size-4" />
                    {row.detail}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="inline-flex items-center gap-1 text-zinc-400">
                    <Music className="size-4" />
                    {row.trackCount}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(row)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      aria-label={`Delete ${row.title}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ReleasesTable;
