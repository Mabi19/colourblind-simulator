<template>
    <div class="photo-button-group">
        <button class="button button-takephoto" @click="takePhoto"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#000"><path d="M0 0h24v24H0z" fill="none"></path><circle cx="12" cy="12" r="3.2"></circle><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"></path></svg></button>
        <button class="button button-gallery" @click="showGallery"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"></path></svg></button>
    </div>
    <div class="takephoto-overlay" :class="{ shown: overlayShown }" @animationend="hideOverlay"></div>
    <Modal title="Zdjęcia" :open="galleryShown" @close="closeGallery">
        <div class="gallery-container">
            <PhotoEntry v-for="entry in galleryData" :data="entry" />
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { galleryData } from "../GalleryData";
import Modal from "./Modal.vue";
import PhotoEntry from "./PhotoEntry.vue";

const emit = defineEmits<{
    (event: "takephoto"): void
}>();

const overlayShown = ref(false);
const galleryShown = ref(false);

function takePhoto() {
    emit("takephoto");
    overlayShown.value = true;
}

function hideOverlay() {
    overlayShown.value = false;
}

function showGallery() {
    galleryShown.value = true;
}

function closeGallery() {
    galleryShown.value = false;
}

</script>

<style scoped>
.photo-button-group {
    position: fixed;
    top: 16px;
    left: 16px;

    display: flex;
    flex-flow: row nowrap;
    gap: 16px;
    z-index: 1;
}

.photo-button-group .button {
    position: static;
}

@keyframes flash {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

.takephoto-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 3;
    background-color: white;
}

.takephoto-overlay.shown {
    display: block;
    animation: flash .3s;
}

.gallery-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);

    display: grid;
    place-items: center;
    z-index: 2;
}

.gallery-window {
    width: max-content;
    height: max-content;
    max-width: 100%;
    max-height: 100%;

    background-color: white;
    border-radius: 16px;
}

</style>