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
import JsonEditor from "@/components/JsonEditor.vue";

import { request } from "../helper";
import { addNotification } from "@/components/Notifications.vue";

import { itemStore } from "../store.js";
const items = itemStore();

export default defineComponent({
    components: {
        ActionsButtons,
        EditorProperty,
        JsonEditor,
        Tabs
    },
    data() {
        return {
            editItem: null,
            tabItems: [{
                name: "Overview",
                id: "overview",
            }, {
                name: "Add",
                id: "add"
            }],
            json: null
        };
    },
    computed: {
        mqtt() {
            return items.mqtt;
        }
    },
    methods: {
        triggerUpdate(item) {
            items.update("mqtt", item);
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
            items.remove("mqtt", item);
        },
        addItem(event) {

            let {
                description,
                topic
            } = event.target.elements;

            console.log("ADD item", description, topic)

            items.add("mqtt", {
                description: description.value || null,
                topic: topic.value || null
            }, (err, data) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`MQTT item "${data._id}" added`, {
                        type: "success"
                    });

                    description.value = "";
                    topic.value = "";

                }
            });

        },
        handleJson(item) {
            console.log("")
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
                            <th scope="col">Description</th>
                            <th scope="col">Topic</th>
                            <th scope="col">Timestamps</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="(item, index) in mqtt">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="description"
                                    type="text" />
                            </td>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="topic"
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
                                    <!--
                                    <tr>
                                        <td>Published:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.published || 0, "yyyy.mm.dd - HH:MM") }}
                                        </td>
                                    </tr>
                                    -->
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
            <template v-slot:add>
                <div class="row">
                    <div class="col-6">
                        <form @submit.prevent="addItem">
                            <div class="form-group mb-2">
                                <label>Description</label>
                                <input type="text" name="description" class="form-control bg-dark text-white" />
                            </div>
                            <div class="form-group mb-2">
                                <label>Topic</label>
                                <input type="text" name="topic" class="form-control bg-dark text-white" />
                            </div>
                            <button type="submit" class="btn btn-outline-primary">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            </template>
        </Tabs>
    </div>
</template>
