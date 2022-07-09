<template>
    <button class="button button-help" @click="showHelp">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="2 2 20 20" fill="currentColor" color="#000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M13 19H11V17H13V19ZM15.07 11.25 14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9 14 7.9 13.1 7 12 7S10 7.9 10 9H8C8 6.79 9.79 5 12 5S16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z"></path></svg>
    </button>
    <Modal title="O aplikacji" :open="modalOpen" @close="closeHelp">
        <div class="modal-content-wrapper">
            <p>
                To jest aplikacja pozwalająca na obserwację świata jak osoba z ślepotą barw.<br>
                Symulacja nie jest idealna;
                oprócz tego prawdziwe osoby z chorobami tego typu mogą nie widzieć kilku kolorów naraz lub widzieć jeden słabiej.<br>
                Rekomendowane jest użycie najnowszej wersji przeglądarki Google Chrome lub Mozilla Firefox.
            </p>
            <p>
                <div>Kod źródłowy: <a href="https://github.com/Mabi19/colourblind-simulator">https://github.com/Mabi19/colourblind-simulator</a></div>
                <div>Ikony: <a href="https://www.material.io/icons">Material Icons</a></div>
                <div><a href="https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html">Więcej o symulowaniu ślepoty barw</a></div>
            </p>
            <div>
                v{{ appVersion }} <!-- TODO: version (with fancy github commit id!) -->
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Modal from "./Modal.vue";

let modalOpen = ref(false);

function showHelp() {
    modalOpen.value = true;
}

function closeHelp() {
    modalOpen.value = false;
}

const appVersion = APP_VERSION;

</script>

<style scoped>
.button-help {
    top: 16px;
    right: 16px;
}

.modal-content-wrapper {
    width: max-content;
    max-width: min(calc(100vw - 24px), 80ch); /* 2 paddings */
}
</style>