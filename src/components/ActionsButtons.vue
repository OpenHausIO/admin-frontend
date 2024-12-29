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
/*
https: //codepen.io/tutsplus/pen/WROvdG
*/

/* START TOOLTIP STYLES */
[tooltip] {
    position: relative;
    /* opinion 1 */
}

/* Applies to all tooltips */
[tooltip]::before,
[tooltip]::after {
    text-transform: none;
    /* opinion 2 */
    font-size: .9em;
    /* opinion 3 */
    line-height: 1;
    user-select: none;
    pointer-events: none;
    position: absolute;
    display: none;
    opacity: 0;
}

[tooltip]::before {
    content: '';
    border: 5px solid transparent;
    /* opinion 4 */
    z-index: 1001;
    /* absurdity 1 */
}

[tooltip]::after {
    content: attr(tooltip);
    /* magic! */

    /* most of the rest of this is opinion */
    font-family: Helvetica, sans-serif;
    text-align: center;

    /* 
    Let the content set the size of the tooltips 
    but this will also keep them from being obnoxious
    */
    min-width: 3em;
    max-width: 21em;
    white-space: nowrap;
    /*nowrap*/
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 1ch 1.5ch;
    border-radius: .3ch;
    /*box-shadow: 0 1em 2em -.5em rgba(0, 0, 0, 0.35);*/
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    z-index: 1000;
    /* absurdity 2 */
}

/* Make the tooltips respond to hover */
[tooltip]:hover::before,
[tooltip]:hover::after {
    display: block;
}

/* don't show empty tooltips */
[tooltip='']::before,
[tooltip='']::after {
    display: none !important;
}

/* FLOW: UP */
[tooltip]:not([flow])::before,
[tooltip][flow^="up"]::before {
    bottom: 100%;
    border-bottom-width: 0;
    border-top-color: #000;
}

[tooltip]:not([flow])::after,
[tooltip][flow^="up"]::after {
    bottom: calc(100% + 5px);
}

[tooltip]:not([flow])::before,
[tooltip]:not([flow])::after,
[tooltip][flow^="up"]::before,
[tooltip][flow^="up"]::after {
    left: 50%;
    transform: translate(-50%, -.5em);
}

/* FLOW: DOWN */
[tooltip][flow^="down"]::before {
    top: 100%;
    border-top-width: 0;
    border-bottom-color: #000;
}

[tooltip][flow^="down"]::after {
    top: calc(100% + 5px);
}

[tooltip][flow^="down"]::before,
[tooltip][flow^="down"]::after {
    left: 50%;
    transform: translate(-50%, .5em);
}

/* FLOW: LEFT */
[tooltip][flow^="left"]::before {
    top: 50%;
    border-right-width: 0;
    border-left-color: #000;
    left: calc(0em - 5px);
    transform: translate(-.5em, -50%);
}

[tooltip][flow^="left"]::after {
    top: 50%;
    right: calc(100% + 5px);
    transform: translate(-.5em, -50%);
}

/* FLOW: RIGHT */
[tooltip][flow^="right"]::before {
    top: 50%;
    border-left-width: 0;
    border-right-color: #000;
    right: calc(0em - 5px);
    transform: translate(.5em, -50%);
}

[tooltip][flow^="right"]::after {
    top: 50%;
    left: calc(100% + 5px);
    transform: translate(.5em, -50%);
}

/* KEYFRAMES */
@keyframes tooltips-vert {
    to {
        opacity: .9;
        transform: translate(-50%, 0);
    }
}

@keyframes tooltips-horz {
    to {
        opacity: .9;
        transform: translate(0, -50%);
    }
}

/* FX All The Things */
[tooltip]:not([flow]):hover::before,
[tooltip]:not([flow]):hover::after,
[tooltip][flow^="up"]:hover::before,
[tooltip][flow^="up"]:hover::after,
[tooltip][flow^="down"]:hover::before,
[tooltip][flow^="down"]:hover::after {
    animation: tooltips-vert 300ms ease-out forwards;
}

[tooltip][flow^="left"]:hover::before,
[tooltip][flow^="left"]:hover::after,
[tooltip][flow^="right"]:hover::before,
[tooltip][flow^="right"]:hover::after {
    animation: tooltips-horz 300ms ease-out forwards;
}
</style>