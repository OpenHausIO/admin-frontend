<template>
    <Modal title="Commands" :xl="true" :visible="true" @close="this.$emit('close')" @confirm="saveStates">
        <template #body class="p-0 m-0">

            <table class="table text-white">
                <thead>
                    <tr>
                        <th scope="col" style="width: 10px">#</th>
                        <th scope="col" style="width: 10px">
                            Sort
                        </th>
                        <th scope="col" style="width: 10px">Icon</th>
                        <th scope="col">Name</th>
                        <th scope="col">Alias</th>
                        <th scope="col">Payload</th>
                        <th scope="col" style="width: 10px">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(item, index) in commands" :key="item._id">
                        <!-- Drop indicator BEFORE the row -->
                        <tr v-if="dragOverIndex === index && draggedIndex !== index" class="drop-indicator">
                            <td colspan="7">
                                <div class="drop-line"></div>
                            </td>
                        </tr>

                        <tr :draggable="true" @dragstart="dragStart(index, $event)"
                            @dragover.prevent="dragOver(index, $event)" @dragenter.prevent="dragEnter(index)"
                            @dragleave="dragLeave" @dragend="dragEnd" @drop="drop(index)"
                            :class="{ 'dragging': draggedIndex === index }">
                            <th scope="row">{{ index + 1 }}</th>
                            <td style="cursor: move;">
                                <i class="fa-solid fa-grip-vertical"></i>
                            </td>
                            <td>

                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="icon" type="text">
                                    <template v-slot:editor="{ value }">

                                        <IconSelect :item="item" :icon="value" />
                                    </template>
                                    <template v-slot:display="{ value }">
                                        <i :class="value"></i>
                                    </template>
                                </EditorProperty>

                            </td>
                            <td>

                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="name"
                                    type="text" />

                            </td>
                            <td>

                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="alias"
                                    type="text" />

                            </td>
                            <td>

                                <!--{{ item.payload ?? "null" }}-->

                                <HexEditor v-if="item.payload" :payload="item.payload" :readonly="false" />
                                <span class="text-warning" v-else>
                                    null
                                </span>

                            </td>
                            <td>

                                <ActionsButtons :showEdit="true" :showRemove="true" :showJSON="false" :item="item"
                                    @handleEdit="handleEdit" @handleRemove="handleRemove">
                                    <template v-slot:custom>

                                        <button class="btn btn-outline-secondary hide">
                                            <i class="fa-solid fa-square-binary"></i>
                                        </button>

                                    </template>
                                </ActionsButtons>

                            </td>
                        </tr>

                        <!-- Drop indicator AFTER last row -->
                        <tr v-if="dragOverIndex === index + 1 && index === commands.length - 1" class="drop-indicator">
                            <td colspan="7">
                                <div class="drop-line"></div>
                            </td>
                        </tr>

                    </template>
                </tbody>
            </table>

        </template>
    </Modal>
</template>

<script>
import { defineComponent } from 'vue';
import Modal from './Modal.vue';
import ActionsButtons from "./ActionsButtons.vue";
import EditorProperty from "./EditorProperty.vue";
import IconSelect from "./IconSelect.vue";
import HexEditor from "./HexEditor.vue";
import { itemStore } from "../store.js";

const items = itemStore();

export default defineComponent({
    name: "CommandsEditor",
    emits: ["save", "close"],
    components: {
        Modal,
        ActionsButtons,
        EditorProperty,
        IconSelect,
        HexEditor
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            editItem: null,
            draggedIndex: null,
            dragOverIndex: null
        };
    },
    methods: {
        saveStates() {
            this.$emit("save", this.editItem);
            this.editItem = null;
        },
        handleEdit(item) {
            if (this.editItem === item._id) {
                //this.saveStates(item);
                this.editItem = null;
            } else {
                this.editItem = item._id;
            }
        },
        handleRemove(item) {
            let index = this.item.commands.indexOf(item);
            this.item.commands.splice(index, 1);
        },
        dragStart(index, event) {
            this.draggedIndex = index;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', index);
        },
        dragEnter(index) {
            if (this.draggedIndex === null) return;

            // Bestimme ob wir vor oder nach dem Element droppen
            if (index > this.draggedIndex) {
                this.dragOverIndex = index + 1;
            } else {
                this.dragOverIndex = index;
            }
        },
        dragOver(index, event) {
            event.preventDefault();
        },
        dragLeave() {
            // Optional: könnte man weglassen für stabileres Feedback
        },
        drop(dropIndex) {
            if (this.draggedIndex !== null) {
                const draggedItem = this.commands[this.draggedIndex];

                // Entferne das Element
                this.commands.splice(this.draggedIndex, 1);

                // Berechne den neuen Index
                let newIndex = dropIndex;
                if (dropIndex > this.draggedIndex) {
                    newIndex = dropIndex - 1;
                }

                // Füge es an der neuen Position ein
                this.commands.splice(newIndex, 0, draggedItem);
            }
            this.draggedIndex = null;
            this.dragOverIndex = null;
        },
        dragEnd() {
            this.draggedIndex = null;
            this.dragOverIndex = null;
        }
    },
    computed: {
        commands() {
            return this.item.commands;
        }
    }
});
</script>

<style scoped>
tr.dragging {
    opacity: 0.4;
    background-color: rgba(255, 255, 255, 0.05);
}

tr.drop-indicator {
    height: 4px;
    padding: 0;
    background: transparent;
}

tr.drop-indicator td {
    padding: 0;
    height: 4px;
}

/*
.drop-line {height: 3px;
    background: linear-gradient(90deg, transparent, #007bff, transparent);
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.6);
    animation: pulse 0.8s ease-in-out infinite;
}
*/

.drop-line {
    height: 1px;
    background-color: var(--bs-primary);
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.6;
    }

    50% {
        opacity: 1;
    }
}

td {
    position: relative;
}
</style>