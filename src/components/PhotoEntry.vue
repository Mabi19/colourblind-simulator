<template>
    <div class="gallery-entry">
        <img class="gallery-image" :src="stringifiedURL">
        <div class="gallery-button-box">
            <button class="gallery-button" v-if="canShare" @click="share"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path></svg><span>Udostępnij</span></button>
            <button class="gallery-button" @click="download"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg><span>Pobierz</span></button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { effectNames } from "../Effect";
import { GalleryEntry } from "../GalleryData";

const props = defineProps<{
    data: GalleryEntry
}>();

const stringifiedURL = props.data.url.href;
const file = new File([props.data.image], `img-${props.data.id}-${effectNames[props.data.effect].toLowerCase()}.png`, {type: props.data.image.type})
const shareData: ShareData = {
    files: [file],
}
const canShare = "canShare" in navigator && navigator.canShare(shareData);

async function share() {
    await navigator.share(shareData);
}

function download() {
    const link = document.createElement("a");
    link.href = stringifiedURL;
    link.setAttribute("download", file.name);
    link.click();
}

</script>

<style scoped>
.gallery-entry:not(:last-child) {
    border-bottom: 1px solid gray;
    margin-bottom: 8px;
}
.gallery-image {
    display: block;
    /* max-height: 80vh; */
    max-width: 100%;
    margin: auto;
}

.gallery-button-box {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    padding: 8px 0;
}

.gallery-button {
    padding: 8px 16px;
    border: 1px solid gray;
    background-color: white;
    color: black;
    border-radius: 4px;
    cursor: pointer;

    display: flex;
    flex-flow: row nowrap;
    gap: 4px;

    transition: background-color .3s ease;
}

.gallery-button span {
    height: 24px;
    line-height: 24px;
    vertical-align: top;
}

.gallery-button:hover {
    background-color: whitesmoke;
}
</style>