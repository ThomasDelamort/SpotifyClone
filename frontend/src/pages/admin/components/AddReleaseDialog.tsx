import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { formatDuration, readAudioDuration, titleFromFilename } from "@/lib/audio";
import { apiErrorMessage, cn } from "@/lib/utils";
import { useArtistStore } from "@/stores/useArtistStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { ArrowDown, ArrowUp, Disc3, Music2, Plus, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

// One release = one cover + one or more tracks. Two or more tracks are saved as
// an Album; a lone track is saved as a single, which in this catalogue is just a
// Song with no albumId — so it never gets an Album record, and the cover
// uploaded here becomes that song's own artwork.

interface TrackDraft {
  key: string;
  file: File;
  title: string;
  artist: string; // blank inherits the release artist
  duration: number;
}

const NO_ARTIST = "none";

const AddReleaseDialog = () => {
  const { fetchAlbums, fetchSongs, fetchSingles, fetchStats } = useMusicStore();
  const { artists, fetchArtists } = useArtistStore();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadingFiles, setIsReadingFiles] = useState(false);

  const [cover, setCover] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [artistId, setArtistId] = useState<string>(NO_ARTIST);
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [tracks, setTracks] = useState<TrackDraft[]>([]);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const isSingle = tracks.length === 1;

  useEffect(() => {
    if (open && artists.length === 0) fetchArtists();
  }, [open, artists.length, fetchArtists]);

  // derive the preview from the file rather than mirroring it into state, and
  // revoke the object URL once it is no longer rendered
  const coverPreview = useMemo(
    () => (cover ? URL.createObjectURL(cover) : null),
    [cover],
  );

  useEffect(() => {
    if (!coverPreview) return;
    return () => URL.revokeObjectURL(coverPreview);
  }, [coverPreview]);

  const reset = () => {
    setCover(null);
    setTitle("");
    setArtist("");
    setArtistId(NO_ARTIST);
    setReleaseYear(new Date().getFullYear());
    setTracks([]);
  };

  const handleTracksSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // let the same file be picked again after a removal
    if (files.length === 0) return;

    setIsReadingFiles(true);
    try {
      const drafts = await Promise.all(
        files.map(async (file) => ({
          key: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
          file,
          title: titleFromFilename(file.name),
          artist: "",
          duration: await readAudioDuration(file),
        })),
      );
      setTracks((prev) => [...prev, ...drafts]);
    } finally {
      setIsReadingFiles(false);
    }
  };

  const updateTrack = (key: string, patch: Partial<TrackDraft>) =>
    setTracks((prev) => prev.map((t) => (t.key === key ? { ...t, ...patch } : t)));

  const removeTrack = (key: string) =>
    setTracks((prev) => prev.filter((t) => t.key !== key));

  const moveTrack = (index: number, direction: -1 | 1) =>
    setTracks((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const handleSubmit = async () => {
    if (!cover) return toast.error("Please upload cover artwork");
    if (tracks.length === 0) return toast.error("Please add at least one track");
    if (!artist.trim()) return toast.error("Please enter an artist");
    if (!isSingle && !title.trim()) return toast.error("An album needs a title");
    if (tracks.some((t) => !t.title.trim()))
      return toast.error("Every track needs a title");

    setIsLoading(true);
    try {
      const formData = new FormData();
      // for a single the release title is the track title, which the server
      // falls back to when this is blank
      formData.append("title", title.trim() || tracks[0].title.trim());
      formData.append("artist", artist.trim());
      if (artistId !== NO_ARTIST) formData.append("artistId", artistId);
      if (!isSingle) formData.append("releaseYear", releaseYear.toString());
      formData.append("imageFile", cover);
      formData.append(
        "tracks",
        JSON.stringify(
          tracks.map((t) => ({
            title: t.title.trim(),
            artist: t.artist.trim() || artist.trim(),
            duration: t.duration,
          })),
        ),
      );
      // index-aligned with `tracks` above
      tracks.forEach((t) => formData.append("audioFiles", t.file));

      const { data } = await axiosInstance.post("/admin/releases", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await Promise.all([fetchAlbums(), fetchSongs(), fetchSingles(), fetchStats()]);

      reset();
      setOpen(false);
      toast.success(
        data.type === "single"
          ? `Single "${data.song.title}" released`
          : `Album "${data.album.title}" released with ${tracks.length} tracks`,
      );
    } catch (error) {
      console.error("Create release error:", error);
      toast.error(apiErrorMessage(error, "Failed to create release"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-violet-500 hover:bg-violet-600 text-white">
            <Plus className="mr-2 size-4" />
            New Release
          </Button>
        }
      />

      <DialogContent className="bg-zinc-900 border-zinc-700 sm:max-w-2xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>New Release</DialogTitle>
          <DialogDescription>
            Upload the cover art and the tracks. One track is released as a single,
            two or more become an album.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Release type indicator */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3",
              tracks.length === 0 && "border-zinc-700 bg-zinc-800/40 text-zinc-400",
              isSingle && "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
              tracks.length > 1 && "border-violet-500/40 bg-violet-500/10 text-violet-300",
            )}
          >
            {isSingle ? (
              <Music2 className="size-5 shrink-0" />
            ) : (
              <Disc3 className="size-5 shrink-0" />
            )}
            <div className="text-sm">
              {tracks.length === 0 && "Add tracks to choose a release type"}
              {isSingle && (
                <>
                  <span className="font-semibold">Single</span> — saved as one track
                  with this cover, no album record
                </>
              )}
              {tracks.length > 1 && (
                <>
                  <span className="font-semibold">Album</span> — {tracks.length} tracks
                  sharing this cover
                </>
              )}
            </div>
          </div>

          {/* Cover art */}
          <input
            type="file"
            ref={coverInputRef}
            accept="image/*"
            hidden
            onChange={(e) => setCover(e.target.files?.[0] ?? null)}
          />
          <div
            className="flex items-center gap-4 rounded-lg border-2 border-dashed border-zinc-700 p-4 cursor-pointer hover:border-zinc-600 transition-colors"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="size-20 rounded object-cover shrink-0"
              />
            ) : (
              <div className="size-20 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                <Upload className="size-6 text-zinc-400" />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium">
                {isSingle ? "Single artwork" : "Album artwork"}
              </div>
              <div className="text-xs text-zinc-400 truncate">
                {cover ? cover.name : "Every track on this release uses this image"}
              </div>
              <Button variant="outline" size="sm" className="text-xs mt-2">
                Choose File
              </Button>
            </div>
          </div>

          {/* Release details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">
                {isSingle ? "Single Title" : "Album Title"}
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                placeholder={
                  isSingle ? "Defaults to the track title" : "Enter album title"
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Artist</label>
              <Input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                placeholder="Enter artist name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Link to Artist (Optional)</label>
              <Select
                value={artistId}
                onValueChange={(value) => {
                  const next = value ?? NO_ARTIST;
                  setArtistId(next);
                  // linking should also name the release, so the two never disagree
                  const picked = artists.find((a) => a._id === next);
                  if (picked) setArtist(picked.name);
                }}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 w-full">
                  <SelectValue placeholder="Not linked" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value={NO_ARTIST}>Not linked</SelectItem>
                  {artists.map((a) => (
                    <SelectItem key={a._id} value={a._id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isSingle && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Release Year</label>
                <Input
                  type="number"
                  value={releaseYear}
                  onChange={(e) =>
                    setReleaseYear(
                      parseInt(e.target.value) || new Date().getFullYear(),
                    )
                  }
                  className="bg-zinc-800 border-zinc-700"
                  min={1900}
                  max={new Date().getFullYear()}
                />
              </div>
            )}
          </div>

          {/* Tracks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Tracks {tracks.length > 0 && `(${tracks.length})`}
              </label>
              <input
                type="file"
                ref={audioInputRef}
                accept="audio/*"
                multiple
                hidden
                onChange={handleTracksSelected}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => audioInputRef.current?.click()}
                disabled={isReadingFiles}
              >
                <Plus className="mr-2 size-3" />
                {isReadingFiles ? "Reading files..." : "Add audio files"}
              </Button>
            </div>

            {tracks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-700 px-4 py-8 text-center text-sm text-zinc-500">
                No tracks yet. Select one audio file for a single, or several for an album.
              </div>
            ) : (
              <div className="space-y-2">
                {tracks.map((track, index) => (
                  <div
                    key={track.key}
                    className="flex items-start gap-2 rounded-lg bg-zinc-800/60 p-3"
                  >
                    <div className="w-6 pt-2 text-center text-sm text-zinc-500 shrink-0">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <Input
                        value={track.title}
                        onChange={(e) => updateTrack(track.key, { title: e.target.value })}
                        className="bg-zinc-900 border-zinc-700 h-8"
                        placeholder="Track title"
                      />
                      <Input
                        value={track.artist}
                        onChange={(e) => updateTrack(track.key, { artist: e.target.value })}
                        className="bg-zinc-900 border-zinc-700 h-8"
                        placeholder={
                          artist.trim()
                            ? `${artist.trim()} (features: comma-separated)`
                            : "Track artists (comma-separated)"
                        }
                      />
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="truncate">{track.file.name}</span>
                        <span className="shrink-0">
                          · {track.duration ? formatDuration(track.duration) : "unknown length"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-7 p-0"
                          disabled={index === 0}
                          onClick={() => moveTrack(index, -1)}
                          aria-label="Move track up"
                        >
                          <ArrowUp className="size-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-7 p-0"
                          disabled={index === tracks.length - 1}
                          onClick={() => moveTrack(index, 1)}
                          aria-label="Move track down"
                        >
                          <ArrowDown className="size-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10 self-end"
                        onClick={() => removeTrack(track.key)}
                        aria-label="Remove track"
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-violet-500 hover:bg-violet-600"
            disabled={isLoading || !cover || tracks.length === 0 || !artist.trim()}
          >
            {isLoading
              ? "Uploading..."
              : isSingle
                ? "Release Single"
                : `Release Album (${tracks.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReleaseDialog;
