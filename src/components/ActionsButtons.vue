<script>
import { defineComponent } from "vue";
import { settingsStore } from "../store.js";
const settings = settingsStore();

export default defineComponent({
    props: {
        showEdit: {
            default: false,
            type: Boolean,
        },
        showInfo: {
            default: false,
            type: Boolean,
        },
        showClone: {
            default: false,
            type: Boolean,
        },
        showRemove: {
            default: true,
            type: Boolean,
        },
        item: {
            required: true,
            type: Object,
        },
    },
    data() {
        return {};
    },
    methods: {
        handleEdit() {
            this.$emit("handleEdit", this.item);
        },
        handleInfo() {
            this.$emit("handleInfo", this.item);
        },
        handleClone() {
            this.$emit("handleClone", this.item);
        },
        handleRemove() {
            this.$emit("handleRemove", this.item);
        },
        handleJson(item) {
            this.$emit("handleJson", item);
        }
    },
    emits: [
        "handleEdit", "handleInfo", "handleClone",
        "handleRemove", "handleRemove", "handleJson"
    ],
    computed: {
        settings() {
            return settings;
        }
    }
});
</script>



<template>
    <div class="btn-group" role="group">
        <button type="button" class="btn btn-outline-primary" v-if="showEdit" v-on:click="handleEdit(item)"
            data-tooltip="Edit Item" tooltip="Edit Item" flow="down">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="btn btn-outline-info hide" v-if="showInfo" v-on:click="handleInfo(item)"
            tooltip="View Info" flow="down">
            <i class="fa-solid fa-circle-info"></i>
        </button>
        <button type="button" class="btn btn-outline-secondary" v-if="showClone" v-on:click="handleClone(item)"
            dtooltip="Clone Item" flow="down">
            <i class="fa-regular fa-clone"></i>
        </button>

        <button type="button" class="btn btn-outline-secondary" v-if="settings.expertSettings"
            v-on:click="handleJson(item)" tooltip="Edit JSON" flow="down">
            <i class="fa-solid fa-code"></i>
        </button>

        <slot name="custom"></slot>

        <button type="button" class="btn btn-outline-danger" v-if="showRemove" v-on:click="handleRemove(item)"
            tooltip="Delete Item" flow="left">
            <i class="fa-solid fa-trash-can"></i>
        </button>
    </div>
</template>

<style scope>
.nav-link.active {
    color: red !important;
}

/*.btn-group button.btn:not(:first-child):not(:last-child)*/
.btn-group button.btn:not(:first-child) {
    border-left-color: #000 !important;
    /*border-right-color: #000 !important;*/
}
</style>