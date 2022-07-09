<template>
    <button class="button button-fullscreen" @click="toggleFullscreen">
        <svg v-show="!fullscreen" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>
        <svg v-show="fullscreen" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></svg>
    </button>
</template>

<script setup lang="ts">
import { ref } from "vue";
const fullscreen = ref(false);
async function toggleFullscreen() {
    fullscreen.value = !fullscreen.value;
    if (fullscreen.value) {
        await document.body.requestFullscreen();
        // try to enforce landscape mode
        try {
            await screen.orientation.lock("landscape-primary");
        } catch (err) {
            if ("lockOrientation" in screen) {
                (screen as any).lockOrientation("landscape")
            }
        }
    } else {
        await document.exitFullscreen();
    }
}
</script>

<style scoped>
.button-fullscreen {
    bottom: 16px;
    left: 16px;
}
</style>