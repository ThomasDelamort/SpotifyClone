import { cn, formatArtists } from "@/lib/utils";
import { formatDuration } from "@/lib/audio";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const SongsTable = () => {
  const { songs, albums, isLoading, error, deleteSong } = useMusicStore();

  const albumTitles = useMemo(
    () => new Map(albums.map((album) => [album._id, album.title])),
    [albums],
  );

  if (isLoading && songs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading songs...</div>
      </div>
    );
  }

  if (error && songs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-12.5"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Appears On</TableHead>
          <TableHead>Length</TableHead>
          <TableHead>Release Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {songs.map((song) => {
          // no albumId means this track *is* a release: a single
          const albumTitle = song.albumId ? albumTitles.get(song.albumId) : undefined;

          return (
            <TableRow key={song._id} className="hover:bg-zinc-800/50">
              <TableCell>
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="size-10 rounded object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{song.title}</TableCell>
              <TableCell>{formatArtists(song.artist)}</TableCell>

              <TableCell>
                {song.albumId ? (
                  <Link
                    to={`/albums/${song.albumId}`}
                    className="text-zinc-300 hover:underline"
                  >
                    {albumTitle ?? "Album"}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      "bg-emerald-500/10 text-emerald-400",
                    )}
                  >
                    Single
                  </span>
                )}
              </TableCell>

              <TableCell className="text-zinc-400">
                {song.duration ? formatDuration(song.duration) : "—"}
              </TableCell>

              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Calendar className="size-4" />
                  {song.createdAt?.split("T")[0]}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={() => deleteSong(song._id)}
                    aria-label={`Delete ${song.title}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
export default SongsTable;
