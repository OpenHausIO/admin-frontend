<template>
    <Modal :title="title" :xl="true" :visible="visible" @close="this.$emit('close');" @confirm="this.$emit('save');">
        <template #body>
            <div class="row">
                <div class="col">

                    {{ targetSelection }}

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

                    <button class="btn btn-outline-light d-block w-100 m-2" @click="addButton">
                        <i class="fa-solid fa-plus d-block"></i>
                        Add
                    </button>
                    <button class="btn btn-outline-light d-block w-100 m-2" @click="removeButton">
                        <i class="fa-solid fa-minus d-block"></i>
                        Remove
                    </button>
                    <button class="btn btn-outline-light d-block w-100 m-2" @click="moveUpButton">
                        <i class="fa-solid fa-arrow-up d-block"></i>
                        Move Up
                    </button>
                    <button class="btn btn-outline-light d-block w-100 m-2" @click="moveDownButton">
                        <i class="fa-solid fa-arrow-down d-block"></i>
                        Move Down
                    </button>

                </div>
                <div class="col">

                    <select class="form-select bg-dark border-primary h-100" :size="size"
                        v-model="sourceSelection.selected">
                        <optgroup v-bind:label="sourceItem.label" v-bind:key="sourceItem.key"
                            v-for="sourceItem in sourceSelection.items">
                            <option v-bind:value="item.value" v-bind:key="item.value"
                                v-for="item in sourceItem.options">
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
    emits: ["changed", "added", "moved", "removed", "close", "save"],
    methods: {
        getTargetIndex() {

            let target = this.targetSelection.selected;

            let index = this.targetSelection.items.findIndex((item) => {
                return target.key === item.key;
            });

            return index;

        },
        getSourceIndex() {

            let source = this.sourceSelection.selected;

            let index = this.sourceSelection.items.findIndex((item) => {
                return source.key === item.key;
            });

            return index;

        },
        emitChangeEvent() {
            this.$emit("changed", {
                sourceSelection: this.sourceSelection,
                targetSelection: this.targetSelection
            });
        },
        emitMoved(o_index, n_index) {
            this.$emit("moved", {
                target: this.targetSelection.selected,
                index_old: o_index,
                index_new: n_index
            });
        },
        addButton() {

            let source = this.sourceSelection.selected;
            let index = this.getTargetIndex(source);
            let elem = this.sourceSelection.items[index];

            console.log("source", index, source, elem)

            this.targetSelection.items.push(elem);

            this.emitChangeEvent();

            this.$emit("added", {
                source
            });

        },
        removeButton() {

            let index = this.getTargetIndex();
            let target = this.targetSelection.items[index];
            this.targetSelection.items.splice(index, 1);

            this.emitChangeEvent();

            this.$emit("removed", {
                target
            });

        },
        moveUpButton() {

            let index = this.getTargetIndex();
            let { items } = this.targetSelection;

            let e_old = items[index];
            let e_new = items[index - 1];

            if (!e_old || !e_new) {
                return;
            }

            items.splice(index, 1);
            items.splice(index - 1, 0, e_old);

            this.targetSelection.selected = e_new.key;

            this.emitChangeEvent();
            this.emitMoved(index, index - 1);

        },
        moveDownButton() {

            let index = this.getTargetIndex();
            let { items } = this.targetSelection;

            let e_old = items[index];
            let e_new = items[index + 1];

            if (!e_old || !e_new) {
                return;
            }

            items.splice(index, 1);
            items.splice(index + 1, 0, e_old);

            this.targetSelection.selected = e_new.key;

            this.emitChangeEvent();
            this.emitMoved(index, index + 1);

        }
    }
});
</script>