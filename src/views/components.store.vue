<script setup>
import { getItemByProperty } from "../helper.js";
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
            tabItems: [
                {
                    name: "Overview",
                    id: "overview",
                },
                /*{
                    name: "Add",
                    id: "add",
                },*/
            ],
            json: null
        };
    },
    computed: {
        config() {
            return items.store;
        },
    },
    methods: {
        triggerUpdate(item) {
            items.update("store", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Vault "${item.name}" updated`, {
                        type: "success"
                    });

                }
            });
        },
        handleEdit(item) {
            if (this.editItem === item._id) {
                this.editItem = null;
                this.triggerUpdate(item);
            } else {
                this.editItem = item._id;
            }
        },
        handleInfo() { },
        handleRemove(item) {
            items.remove("store", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Store "${item.name}" removed`, {
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
                            <th scope="col">Config</th>
                            <th scope="col">Values</th>
                            <th scope="col">Timestamps</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="(item, index) in config">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>

                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="name"
                                    type="text" />

                            </td>
                            <td>

                                <table>
                                    <tr v-bind:key="index" v-for="(config, index) in item.config">
                                        <td>{{ config.key }} =</td>
                                        <td>

                                            <EditorProperty :enabled="item._id === editItem"
                                                :object="item.config[index]" prop="value" :type="config.type" />

                                        </td>
                                        <td>({{ config.description }}) </td>
                                    </tr>
                                </table>

                            </td>
                            <td>

                                <table>
                                    <tr>
                                        <td>Created:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.created, settings.dateformat) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Updated:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.updated, settings.dateformat) }}
                                        </td>
                                    </tr>
                                </table>

                            </td>
                            <td>
                                <ActionsButtons :showEdit="true" :showInfo="true" :showRemove="true" :item="item"
                                    @handleEdit="handleEdit" @handleInfo="handleInfo" @handleRemove="handleRemove"
                                    @handleJson="handleJson" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
            <template v-slot:add> Hello from apsdflkasjfdlasdf </template>
        </Tabs>

        <!--store: {{ store }}-->
    </div>
</template>
