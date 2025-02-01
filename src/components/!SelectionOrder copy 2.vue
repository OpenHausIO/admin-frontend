<template>
    <Modal :title="title" :xl="true" :visible="visible" @close="this.$emit('close');" @confirm="this.$emit('save');">
        <template #body>
            <div class="row">
                <div class="col">

                    <select class="form-select bg-dark border-primary h-100" :size="size"
                        v-model="targetSelection.selected">
                        <optgroup v-bind:label="targetItem.label" v-bind:key="targetItem.key"
                            v-for="targetItem in targetSelection.items">
                            <option v-bind:value="item.value" v-bind:key="item.key" v-for="item in targetItem.options">
                                {{ item.name }}
                            </option>
                        </optgroup>
                    </select>

                </div>
                <div class="col-2 m-auto">

                    <button class="btn btn-outline-light d-block w-100 my-3" @click="addButton">
                        <i class="fa-solid fa-plus d-block"></i>
                        Add
                    </button>
                    <button class="btn btn-outline-light d-block w-100 my-3" @click="removeButton">
                        <i class="fa-solid fa-minus d-block"></i>
                        Remove
                    </button>
                    <button class="btn btn-outline-light d-block w-100 my-3" @click="moveUpButton">
                        <i class="fa-solid fa-arrow-up d-block"></i>
                        Move Up
                    </button>
                    <button class="btn btn-outline-light d-block w-100 my-3" @click="moveDownButton">
                        <i class="fa-solid fa-arrow-down d-block"></i>
                        Move Down
                    </button>

                </div>
                <div class="col">

                    <select class="form-select bg-dark border-primary h-100" :size="size"
                        v-model="sourceSelection.selected">
                        <optgroup v-bind:label="sourceItem.label" v-bind:key="sourceItem.key"
                            v-for="sourceItem in sourceSelection.items">
                            <option v-bind:value="JSON.stringify({ option: item.value, item: sourceItem.key })"
                                v-bind:key="item.value" v-for="item in sourceItem.options">
                                {{ item.name }}
                            </option>
                        </optgroup>
                    </select>

                </div>
            </div>
        </template>
    </Modal>
</template>

<script>
import { defineComponent } from "vue";
import Modal from "./Modal.vue";

export default defineComponent({
    components: {
        Modal
    },
    props: {
        items: {
            type: Array,
            defualt: []
        },
        title: {
            type: String,
            default: undefined
        },
        show: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: "20"
        },
        target: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            targetSelection: {
                items: [],
                selected: null
            },
            sourceSelection: {
                items: this.items,
                selected: null
            }
        };
    },
    computed: {
        visible() {
            return this.show;
        }
    },
    mounted() {
        this.targetSelection = this.target;
    },
    emits: ["changed", "added", "moved", "removed", "close", "save"],
    methods: {
        emitEvent(event) {
            this.$emit(event, {
                sourceSelection: this.sourceSelection,
                targetSelection: this.targetSelection
            });
        },
        getTargetIndex() {

            let index = this.targetSelection.items.findIndex((item) => {
                return item.options.find(({ value }) => {
                    return this.targetSelection.selected === value;
                });
            });

            if (index === -1) {
                return;
            }

            return index;

        },
        addButton() {

            let { option, item } = JSON.parse(this.sourceSelection.selected);

            let sourceItem = this.sourceSelection.items.find(({ key }) => {
                return item === key;
            });

            let optionIndex = sourceItem.options.findIndex(({ value }) => {
                return option === value;
            });

            let optionItem = sourceItem.options[optionIndex];

            this.targetSelection.items.push({
                label: sourceItem.label,
                key: sourceItem.key,
                options: [optionItem]
            });

            this.emitEvent("added");
            this.emitEvent("changed");

        },
        removeButton() {

            let index = this.getTargetIndex();
            this.targetSelection.items.splice(index, 1);

            this.emitEvent("removed");
            this.emitEvent("changed");

        },
        moveUpButton() {

            let index = this.getTargetIndex();

            let arr = this.targetSelection.items;
            let targetItem = arr[index];

            arr.splice(index, 1);
            arr.splice(index - 1, 0, targetItem);

            this.emitEvent("moved");
            this.emitEvent("changed");

        },
        moveDownButton() {

            let index = this.getTargetIndex();

            let arr = this.targetSelection.items;
            let targetItem = arr[index];

            arr.splice(index, 1);
            arr.splice(index + 1, 0, targetItem);

            this.emitEvent("moved");
            this.emitEvent("changed");

        }
    }
});
</script>