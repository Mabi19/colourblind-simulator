import { reactive } from "vue";
import { Effect } from "./Effect";

export interface GalleryEntry {
    image: Blob,
    url: URL,
    id: string,
    effect: Effect
}

export const galleryData = reactive<GalleryEntry[]>([]);

export function addImageToGallery(blob: Blob, effect: Effect) {
    galleryData.push({
        image: blob,
        url: new URL(URL.createObjectURL(blob)),
        id: (Math.floor(Math.random() * 65536)).toString(16).padStart(4, "0"),
        effect
    });
}
