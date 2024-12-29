<script setup>
import dateFormat from "dateformat";
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
import { defineComponent } from "vue";

import ActionsButtons from "@/components/ActionsButtons.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import Tabs from "@/components/Tabs.vue";
import IconSelect from "@/components/IconSelect.vue";
import JsonEditor from "@/components/JsonEditor.vue";

import { request } from "../helper";
import { addNotification } from "@/components/Notifications.vue";

import { itemStore } from "../store.js";
const items = itemStore();

export default defineComponent({
    components: {
        IconSelect,
        ActionsButtons,
        EditorProperty,
        Tabs,
        JsonEditor
    },
    data() {
        return {
            editItem: null,
            tabItems: [{
                name: "Overview",
                id: "overview",
            }],
            json: null
        };
    },
    computed: {
        scenes() {
            return items.scenes;
        }
    },
    methods: {
        triggerUpdate(item) {
            items.update("scenes", item);
        },
        handleEdit(item) {
            if (this.editItem === item._id) {
                this.editItem = null;
                this.triggerUpdate(item);
            } else {
                this.editItem = item._id;
            }
        },
        handleRemove(item) {
            items.remove("scenes", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Scene "${item.name}" removed`, {
                        type: "success"
                    });

                }
            });
        },
        handleJson(item) {
            this.json = item;
        },
        onClose() {
            this.json = null;
            this.editItem = null;
        },
        onConfirm(item) {
            this.json = null;
            this.editItem = null;
            this.triggerUpdate(item);
        },
        triggerScene(item) {
            request(`/api/scenes/${item._id}/trigger`, {
                method: "POST"
            }, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Scene "${item.name}" triggered`, {
                        type: "success"
                    });

                }
            });
        },
        abortScene(item) {
            request(`/api/scenes/${item._id}/abort`, {
                method: "POST"
            }, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Scene "${item.name}" aborted`, {
                        type: "success"
                    });

                }
            });
        }
    },
});
</script>


<template>
    <div>

        <JsonEditor v-if="!!json" :item="json" @onClose="onClose" @onConfirm="onConfirm" />

        <Tabs v-bind:items="tabItems">
            <template v-slot:overview>
                <table class="table text-white">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Icon</th>
                            <th scope="col">Name</th>
                            <th scope="col" style="width: 300px">Timestmaps</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="(item, index) in scenes">
                            <th scope="row">{{ index + 1 }}</th>
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
                                <table>
                                    <tr>
                                        <td>Created:</td>
                                        <td> {{ dateFormat(item.timestamps.created || 0, settings.dateformat) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Updated:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.updated || 0, settings.dateformat) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Started:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.started || 0, settings.dateformat) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Aborted:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.aborted || 0, settings.dateformat) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Finished:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.finished || 0, settings.dateformat) }}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td>
                                <ActionsButtons :showEdit="true" :showRemove="true" :item="item"
                                    @handleEdit="handleEdit" @handleRemove="handleRemove" @handleJson="handleJson">
                                    <template v-slot:custom>
                                        <button type="button" class="btn btn-outline-secondary" tooltip="Trigger scene"
                                            flow="down" @click="triggerScene(item)">
                                            <i class="fa-solid fa-eye"></i>
                                        </button>
                                        <button type="button" class="btn btn-outline-secondary" tooltip="Abort scene"
                                            flow="down" @click="abortScene(item)">
                                            <i class="fa-solid fa-eye-slash"></i>
                                        </button>
                                    </template>
                                </ActionsButtons>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </Tabs>
    </div>
</template>
