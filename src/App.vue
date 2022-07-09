<template>
    <FullscreenButton/>
    <HelpButton/>
    <PhotoButtonGroup @takephoto="takePhoto"/>
    <SidePanel @effect-change="(effect) => changeEffect(effect)"/>
    <div class="container">
        <canvas class="canvas" ref="canvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from "vue";
import { ColourblindVisualiser } from "./ColourblindVisualiser";
import { Effect } from "./Effect";
import FullscreenButton from "./components/FullscreenButton.vue";
import HelpButton from "./components/HelpButton.vue";
import SidePanel from "./components/SidePanel.vue";
import PhotoButtonGroup from "./components/PhotoButtonGroup.vue";

type TemplateRef<T> = Ref<T | null>

const canvas: TemplateRef<HTMLCanvasElement> = ref(null);
let cv: ColourblindVisualiser | undefined = undefined;

onMounted(async () => {
    // use the canvas to create the ColourblindVisualiser instance
    if (!canvas.value) throw Error("Nieznany błąd"); // this never happens
    try {
        cv = new ColourblindVisualiser(canvas.value);
        try {
            let width = window.screen.width;
            let height = window.screen.height;
            // swap if portrait
            if (width < height) {
                const temp = height;
                height = width;
                width = temp;
            }
            // use these as ideal width and height
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width, height }, audio: false });
            cv.setMediaStream(stream);
        } catch (err) {
            alert("Nie można uzyskać dostępu do kamery, czy na pewno na to pozwoliłeś/aś?");
        }
        cv.start();
    } catch (err) {
        alert("Wystąpił błąd: " + err);
    }
});

function changeEffect(effect: Effect) {
    if (cv) {
        cv.setEffect(effect);
    }
}

function takePhoto() {
    if (cv) {
        cv.takePhoto();
    }
}
</script>

<style>
.container {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
}

.canvas {
    display: block;
}

</style>
