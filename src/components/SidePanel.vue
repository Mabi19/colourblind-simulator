<template>
    <div class="side-panel" :class="{ shown: isShown }" >
        <button class="side-toggle" @click="toggleShown">
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#000000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
        </button>
        <div class="side-content">
            <div class="effect" @click="setEffect(effect.id)" :class="{ selected: currentlyActive == effect.id }" v-for="effect in effects" :key="effect.id">
                <img :src="effect.image" class="effect-icon"><span class="label">{{ effect.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Effect, effectNames, effectImages } from "../Effect";
const isShown = ref(false);
const currentlyActive = ref(Effect.None);

const effects = Object.entries(effectNames).map(([key, value]) => {
    return {
        id: Number(key) as Effect,
        name: value,
        image: effectImages[Number(key) as Effect]
    }
});

function toggleShown() {
    isShown.value = !isShown.value;
}

const emit = defineEmits<{
    (event: "effect-change", effect: Effect): void
}>();

function setEffect(effect: Effect) {
    if (currentlyActive.value != effect) {
        currentlyActive.value = effect;
        emit("effect-change", effect);
    }
}
</script>

<style scoped>
.side-panel {
    max-width: 100vw;
    width: max-content;
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 1;
    display: flex;
    flex-flow: row nowrap;
    gap: 16px;
    align-items: flex-end;
    margin: 16px 0 16px 16px;

    transition: transform .2s ease-in-out;
}

.side-panel:not(.shown) {
    transform: translateX(calc(100% - 56px));
}

.side-panel.shown .side-toggle svg {
    transform: scaleX(-1);
}

.side-toggle {
    display: block;
    background-color: white;
    border-radius: 50%;
    border: none;
    padding: 8px;
    cursor: pointer;
    box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.20);
}

.side-toggle svg {
    display: block;
    transition: transform .2s ease-in-out;
}

.side-content {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    background-color: white;
    padding: 16px;
    height: max-content;
    max-height: calc(100vh - 32px); /* account for container margins */
    overflow-y: auto; /* scroll when too large */
    display: flex;
    flex-flow: column nowrap;
}

.effect {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
}

.effect.selected {
    background-color: black;
    outline: 2px solid black;
    color: white;
    cursor: initial;
}

.effect span {
    height: 32px;
    line-height: 32px;
    display: inline-block;
}

.effect-icon {
    width: 32px;
    height: 32px;
    border-radius: 25%;
}

</style>