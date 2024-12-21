<template>
    <Modal :visible="show" v-bind:classes="{ 'body': 'p-0' }" v-bind:title="'Edit item'" @close="onClose"
        @confirm="onConfirm">
        <template v-slot:body>
            <JsonEditorVue v-model="localItem" v-model:mode="editorOptions.mode" v-bind="editorOptions"
                class="jse-theme-dark" />
        </template>
    </Modal>
</template>

<script setup>
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
</script>

<script>
import { defineComponent } from "vue";
import JsonEditorVue from 'json-editor-vue';
import Modal from './Modal.vue';

export default defineComponent({
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    components: {
        Modal,
        JsonEditorVue
    },
    emits: ["onClose", "onConfirm", "onChange"],
    data() {
        return {
            localItem: { ...this.item },
            editorOptions: {
                mode: "text",
                mainMenuBar: false,
                indentation: 4
            }
        };
    },
    computed: {
        show() {
            return this.item ? true : false;
        }
    },
    methods: {
        onClose() {

            let obj = null;

            try {
                obj = JSON.parse(this.localItem);
            } catch (e) {
                // ignore
            } finally {
                this.$emit("onClose", obj);
            }

        },
        onConfirm() {

            let obj = null;

            try {
                obj = JSON.parse(this.localItem);
            } catch (e) {
                // ignore
            } finally {
                this.$emit("onConfirm", obj);
            }

        }
    },
    watch: {
        item(newItem) {
            this.localItem = { ...newItem };
        }
    }
});
</script>