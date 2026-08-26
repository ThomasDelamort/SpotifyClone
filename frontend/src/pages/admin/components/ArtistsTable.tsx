import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useArtistStore } from "@/stores/useArtistStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Disc3, Music, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const ArtistsTable = () => {
  const { artists, deleteArtist, isLoading, error } = useArtistStore();
  const { albums, songs } = useMusicStore();

  // Album.artistId is a single ref; Song.artistId is a list (features), so the
  // two are tallied separately rather than with one shared helper.
  const linkCounts = useMemo(() => {
    const counts = new Map<string, { albums: number; songs: number }>();

    const bump = (id: string, key: "albums" | "songs") => {
      const entry = counts.get(id) ?? { albums: 0, songs: 0 };
      entry[key] += 1;
      counts.set(id, entry);
    };

    albums.forEach((album) => {
      if (album.artistId) bump(album.artistId, "albums");
    });
    songs.forEach((song) => {
      song.artistId?.forEach((id) => bump(id, "songs"));
    });

    return counts;
  }, [albums, songs]);

  if (isLoading && artists.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-zinc-400">
        Loading artists...
      </div>
    );
  }

  if (error && artists.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-red-400">{error}</div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-700 px-4 py-10 text-center text-sm text-zinc-500">
        No artists yet. Add one so releases can link to a shared artist page.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-12.5"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Linked Albums</TableHead>
          <TableHead>Linked Songs</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {artists.map((artist) => {
          const counts = linkCounts.get(artist._id) ?? { albums: 0, songs: 0 };

          return (
            <TableRow key={artist._id} className="hover:bg-zinc-800/50">
              <TableCell>
                {artist.imageUrl ? (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-500">
                    {artist.name.charAt(0)}
                  </div>
                )}
              </TableCell>

              <TableCell className="font-medium">
                <Link to={`/artists/${artist._id}`} className="hover:underline">
                  {artist.name}
                </Link>
              </TableCell>

              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Disc3 className="size-4" />
                  {counts.albums}
                </span>
              </TableCell>

              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Music className="size-4" />
                  {counts.songs}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteArtist(artist._id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    aria-label={`Delete ${artist.name}`}
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

export default ArtistsTable;
