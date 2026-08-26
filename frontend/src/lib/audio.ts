// Read a track's duration straight from the file the admin picked, so uploading
// an album doesn't mean typing a length for every track. Resolves 0 when the
// browser can't decode the file — the server treats that as "unknown".
export const readAudioDuration = (file: File): Promise<number> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();

    const done = (seconds: number) => {
      URL.revokeObjectURL(url);
      resolve(seconds);
    };

    audio.preload = "metadata";
    audio.onloadedmetadata = () =>
      done(Number.isFinite(audio.duration) ? Math.round(audio.duration) : 0);
    audio.onerror = () => done(0);
    audio.src = url;
  });

export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// "03 - Smells Like Teen Spirit.mp3" -> "Smells Like Teen Spirit"
export const titleFromFilename = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .replace(/^\s*\d+\s*[-._)]\s*/, "")
    .replace(/_+/g, " ")
    .trim();
