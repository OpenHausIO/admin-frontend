<template>
    <Modal :title="title" :xl="true" :visible="show" @close="this.$emit('close')" @confirm="this.$emit('save')">
        <template #body>
            <div class="row">

                <!-- LEFT -->
                <div class="col">

                    <!-- SELECTION TARGET-->
                    <ObjectSelect class="bg-dark border-primary h-100" :options="targetSelection.options" :size="size"
                        v-model="targetSelection.selected"></ObjectSelect>
                    <!-- SELECTION TARGET-->

                </div>
                <!-- LEFT -->

                <!-- MIDDLE -->
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
                    <slot name="buttons"></slot>

                </div>
                <!-- MIDDLE -->

                <!-- RIGHT -->
                <div class="col">

                    <!-- SELECTION SOURCE-->
                    <ObjectSelect class="bg-dark border-primary h-100" :options="sourceSelection.options" :size="size"
                        v-model="sourceSelection.selected">
                    </ObjectSelect>
                    <!-- SELECTION SOURCE-->

                </div>
                <!-- RIGHT -->

            </div>
            <div class="row">
                <slot name="footer"> </slot>
            </div>
        </template>
    </Modal>
</template>

<script>
import { defineComponent } from 'vue';
import Modal from './Modal.vue';
import ObjectSelect from "./ObjectSelect.vue";

export default defineComponent({
    components: {
        Modal,
        ObjectSelect
    },
    props: {
        title: {
            type: String,
            default: undefined,
        },
        show: {
            type: Boolean,
            default: false,
        },
        sourceOptions: {
            type: Array,
            default: () => []
        },
        targetOptions: {
            type: Array,
            default: () => []
        },
        size: {
            type: Number,
            default: 20,
        },
    },
    data() {
        return {
            sourceSelection: {
                options: [],
                selected: null
            },
            targetSelection: {
                options: [],
                selected: null,
            }
        };
    },
    watch: {
        targetOptions(newValue) {
            this.targetSelection.options = newValue;
        },
        sourceOptions(newValue) {
            this.sourceSelection.options = newValue;
        }
    },
    mounted() {

        console.log("targetOptions propss", this.targetOptions)

        if (this.sourceOptions && Array.isArray(this.sourceOptions)) {
            this.sourceSelection.options = this.sourceOptions;
        }

        if (this.targetOptions && Array.isArray(this.targetOptions)) {
            this.targetSelection.options = this.targetOptions;
        }

    },
    methods: {
        addButton() {

            let { group, item } = this.sourceSelection.selected;

            this.targetSelection.options.push({
                key: group.key,
                label: group.label,
                options: [item]
            });

        },
        removeButton() {

            let { indexes } = this.targetSelection.selected;
            this.targetSelection.options.splice(indexes.optgroup, 1);

        },
        moveUpButton() {

            let { indexes } = this.targetSelection.selected;
            let arr = this.targetSelection.options;

            if (!indexes || indexes.optgroup <= 0) {
                return;
            }

            let [movedGroup] = arr.splice(indexes.optgroup, 1);
            arr.splice(indexes.optgroup - 1, 0, movedGroup);

            this.targetSelection.selected = {
                group: movedGroup,
                item: movedGroup.options[0],
                indexes: {
                    optgroup: indexes.optgroup - 1,
                    option: 0
                }
            };

        },
        moveDownButton() {

            let { indexes } = this.targetSelection.selected;
            let arr = this.targetSelection.options;

            if (!indexes || indexes.optgroup >= arr.length - 1) {
                return;
            }

            let [movedGroup] = arr.splice(indexes.optgroup, 1);
            arr.splice(indexes.optgroup + 1, 0, movedGroup);

            this.targetSelection.selected = {
                group: movedGroup,
                item: movedGroup.options[0],
                indexes: {
                    optgroup: indexes.optgroup + 1,
                    option: 0
                }
            };

        },
    }
});
</script>
