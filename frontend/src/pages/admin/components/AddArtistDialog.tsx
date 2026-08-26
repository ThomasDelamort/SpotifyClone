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
import { useArtistStore } from "@/stores/useArtistStore";
import { Plus, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const AddArtistDialog = () => {
  const { createArtist, isLoading } = useArtistStore();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const handleSubmit = async () => {
    const created = await createArtist({ name: name.trim(), imageFile });
    if (!created) return; // the store already surfaced the reason

    setName("");
    setImageFile(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="mr-2 size-4" />
            Add Artist
          </Button>
        }
      />

      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle>Add New Artist</DialogTitle>
          <DialogDescription>
            Artists can be linked from a release so their page collects everything
            they appear on.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <input
            type="file"
            ref={inputRef}
            accept="image/*"
            hidden
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />

          <div
            className="flex items-center gap-4 rounded-lg border-2 border-dashed border-zinc-700 p-4 cursor-pointer hover:border-zinc-600 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Artist preview"
                className="size-20 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="size-20 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                <Upload className="size-6 text-zinc-400" />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium">Artist photo (optional)</div>
              <div className="text-xs text-zinc-400 truncate">
                {imageFile ? imageFile.name : "Shown on the artist page"}
              </div>
              <Button variant="outline" size="sm" className="text-xs mt-2">
                Choose File
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter artist name"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? "Saving..." : "Add Artist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddArtistDialog;
