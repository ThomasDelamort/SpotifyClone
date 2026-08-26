import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { formatDuration, readAudioDuration, titleFromFilename } from "@/lib/audio";
import { apiErrorMessage } from "@/lib/utils";

// Adds one track to the catalogue. Use this to extend an album that already
// exists; leaving the album unset publishes the track as a standalone single.
// To publish a whole release at once, use "New Release" on the Releases tab.

const NO_ALBUM = "none";

const AddSongDialog = () => {
  const { albums, fetchAlbums, fetchSongs, fetchSingles, fetchStats } = useMusicStore();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [albumId, setAlbumId] = useState<string>(NO_ALBUM);
  const [duration, setDuration] = useState(0);

  const [audio, setAudio] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isSingle = albumId === NO_ALBUM;

  const preview = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image],
  );

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const handleAudioSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;

    setAudio(file);
    // fill in what we can read from the file so the admin doesn't have to
    setDuration(await readAudioDuration(file));
    setTitle((current) => current || titleFromFilename(file.name));
  };

  const reset = () => {
    setTitle("");
    setArtist("");
    setAlbumId(NO_ALBUM);
    setDuration(0);
    setAudio(null);
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!audio || !image) {
      return toast.error("Please select both an audio file and artwork");
    }
    if (!title.trim()) return toast.error("Please enter a title");
    if (!artist.trim()) return toast.error("Please enter an artist");

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("artist", artist.trim());
      formData.append("duration", duration.toString());
      if (!isSingle) formData.append("albumId", albumId);
      formData.append("audioFile", audio);
      formData.append("imageFile", image);

      await axiosInstance.post("/admin/songs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // the tables read from the store, so pull the new state before closing
      await Promise.all([fetchSongs(), fetchSingles(), fetchAlbums(), fetchStats()]);

      reset();
      setOpen(false);
      toast.success(isSingle ? "Single published" : "Track added to album");
    } catch (error) {
      console.error("Add song error:", error);
      toast.error(apiErrorMessage(error, "Failed to add song"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
            <Plus className="mr-2 size-4" />
            Add Track
          </Button>
        }
      />

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Track</DialogTitle>
          <DialogDescription>
            Add one track to an existing album, or leave the album unset to publish it
            as a single.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <input
            type="file"
            accept="audio/*"
            ref={audioInputRef}
            hidden
            onChange={handleAudioSelected}
          />
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            hidden
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />

          <div
            className="flex items-center gap-4 rounded-lg border-2 border-dashed border-zinc-700 p-4 cursor-pointer hover:border-zinc-600 transition-colors"
            onClick={() => imageInputRef.current?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Artwork preview"
                className="size-20 rounded object-cover shrink-0"
              />
            ) : (
              <div className="size-20 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                <Upload className="size-6 text-zinc-400" />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium">
                {isSingle ? "Single artwork" : "Track artwork"}
              </div>
              <div className="text-xs text-zinc-400 truncate">
                {image ? image.name : "Upload the cover for this track"}
              </div>
              <Button variant="outline" size="sm" className="text-xs mt-2">
                Choose File
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Audio File</label>
            <Button
              variant="outline"
              onClick={() => audioInputRef.current?.click()}
              className="w-full rounded-md justify-start"
            >
              {audio ? audio.name : "Choose Audio File"}
            </Button>
            {audio && (
              <p className="text-xs text-zinc-500">
                Length detected: {duration ? formatDuration(duration) : "unknown"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter song title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter artist name (comma-separated for features)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Album</label>
            <Select
              value={albumId}
              onValueChange={(value) => setAlbumId(value ?? NO_ALBUM)}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 w-full">
                <SelectValue placeholder="Select album" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value={NO_ALBUM}>No album — publish as a single</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-emerald-500 hover:bg-emerald-600 text-black"
            disabled={isLoading || !audio || !image || !title.trim() || !artist.trim()}
          >
            {isLoading ? "Uploading..." : isSingle ? "Publish Single" : "Add to Album"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddSongDialog;
