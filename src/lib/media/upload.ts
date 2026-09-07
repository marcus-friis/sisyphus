import { open } from "@tauri-apps/plugin-dialog";
import { appDataDir, join } from "@tauri-apps/api/path";
import { mkdir, copyFile, exists } from "@tauri-apps/plugin-fs";
import { convertFileSrc } from "@tauri-apps/api/core";

const IMAGE_EXT = ["png", "jpg", "jpeg", "webp", "heic"];
const VIDEO_EXT = ["mp4", "mov", "webm"];

export interface PickedMedia {
  storedPath: string; // absolute path on disk, saved in the DB
  displaySrc: string; // convertFileSrc() output, usable directly in <img>/<video>
  type: "photo" | "video";
}

export async function pickMediaFile(): Promise<PickedMedia | null> {
  const selected = await open({
    multiple: false,
    filters: [{ name: "Media", extensions: [...IMAGE_EXT, ...VIDEO_EXT] }],
  });

  if (!selected) return null; // user cancelled the dialog

  const sourcePath = selected as string;
  const ext = sourcePath.split(".").pop()?.toLowerCase() ?? "";
  const type: "photo" | "video" = VIDEO_EXT.includes(ext) ? "video" : "photo";

  const dataDir = await appDataDir();
  const mediaDir = await join(dataDir, "media");
  if (!(await exists(mediaDir))) {
    await mkdir(mediaDir, { recursive: true });
  }

  // Prefix with a timestamp so two photos with the same original filename
  // (e.g. two "IMG_0001.jpg" from different camera rolls) never collide.
  const filename = `${Date.now()}-${sourcePath.split(/[\\/]/).pop()}`;
  const destPath = await join(mediaDir, filename);

  await copyFile(sourcePath, destPath);

  return { storedPath: destPath, displaySrc: convertFileSrc(destPath), type };
}
