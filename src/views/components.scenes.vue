<script setup>
import dateFormat from "dateformat";
</script>

<script>
import { defineComponent } from "vue";
import store from "../store.js";

import ActionsButtons from "@/components/ActionsButtons.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import Tabs from "@/components/Tabs.vue";
import IconSelect from "@/components/IconSelect.vue";
import JsonEditor from "@/components/JsonEditor.vue";

import { request } from "../helper";
import { addNotification } from "@/components/Notifications.vue";

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
        items() {
            return store.state.scenes;
        }
    },
    methods: {
        handleEdit(item) {
            if (this.editItem === item._id) {
                this.editItem = null;
            } else {
                this.editItem = item._id;
            }
        },
        handleRemove() { },
        handleJson(item) {
            this.json = item;
        },
        onClose() {
            this.json = null;
            this.editItem = null;
        },
        onConfirm(data) {

            request(`/api/scenes/${data._id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            }, (err) => {
                if (err || data.error) {

                    addNotification(`Error: ${err || data.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Scenes item "${data._id}" updated`, {
                        type: "success"
                    });

                }
            });

            this.json = null;
            this.editItem = null;

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
                        <tr v-bind:key="item._id" v-for="(item, index) in items">
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
                                        <td> {{ dateFormat(item.timestamps.created || 0, "yyyy.mm.dd - HH:MM") }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Updated:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.updated || 0, "yyyy.mm.dd - HH:MM") }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Started:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.started || 0, "yyyy.mm.dd - HH:MM") }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Aborted:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.aborted || 0, "yyyy.mm.dd - HH:MM") }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Finished:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.finished || 0, "yyyy.mm.dd - HH:MM") }}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td>
                                <ActionsButtons :showEdit="true" :showRemove="true" :item="item"
                                    @handleEdit="handleEdit" @handleRemove="handleRemove" @handleJson="handleJson" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </Tabs>
    </div>
</template>
