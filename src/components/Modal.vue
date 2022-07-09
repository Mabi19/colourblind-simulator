<template>
    <Teleport to="body">
        <Transition>
            <div v-if="open" class="modal-backdrop" @click.self="closeModal">
                <div class="modal-window">
                    <div class="modal-heading">
                        <span class="modal-heading-text">{{ title }}</span>
                        <svg class="modal-heading-close" @click="closeModal" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                    </div>
                    <div class="modal-content">
                        <slot/>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
const _props = defineProps<{
    title: string,
    open: boolean
}>();

const emit = defineEmits<{
    (event: "close"): void
}>();

function closeModal() {
    emit("close");
}

</script>

<style scoped>
.modal-backdrop {
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

.modal-window {
    width: max-content;
    height: max-content;
    max-width: 100%;
    max-height: 100%;

    background-color: white;
    border-radius: 16px;

    overflow: hidden; /* hide potential scrollbar overflow */
}

.modal-heading {
    border-bottom: 1px solid gray;
    padding: 12px;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-heading-text {
    font-weight: bold;
}

.modal-heading-close {
    cursor: pointer;
}

.modal-content {
    padding: 12px;
    max-width: calc(100vw - 24px); /* two paddings */
    max-height: calc(90vh - 97px); /* four 12px paddings + one 1px border + one 24px icon + 24px extra padding */
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable both-edges;
}

.v-enter-active,
.v-leave-active {
    transition: opacity .5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
