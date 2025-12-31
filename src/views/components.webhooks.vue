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
import TimestampsTable from "@/components/TimestampsTable.vue";

import { request } from "../helper";
import { addNotification } from "@/components/Notifications.vue";

import { itemStore } from "../store.js";
const items = itemStore();

export default defineComponent({
    components: {
        ActionsButtons,
        EditorProperty,
        JsonEditor,
        Tabs,
        TimestampsTable
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
        webhooks() {
            return items.webhooks;
        }
    },
    methods: {
        triggerUpdate(item) {
            items.update("webhooks", item);
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
            items.remove("webhooks", item);
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
        triggerWebhook(item) {
            request(`/api/webhooks/${item._id}/trigger`, (err) => {
                if (err) {

                    addNotification(`Error: ${err.message}`, {
                        dismiss: false,
                        type: "danger"
                    });

                } else {

                    addNotification(`Triggered Webhook "${item.name}"`, {
                        type: "success"
                    });

                }
            });
        },
        addWebhook(event) {

            let { name } = event.target.elements;

            items.add("webhooks", {
                name: name.value || null,
            }, (err, data) => {
                if (err) {

                    addNotification(`Error: ${err || data.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Webhook "${data.name}" added`, {
                        type: "success"
                    });

                    name.value = "";
                    //icon.value = "";

                }
            });

        },
        generateURL(item) {

            let { hostname, port } = window.location;
            return `http://${hostname}:${port}/api/webhooks/${item._id}/trigger`;

        },
        async copyURL(item) {
            try {

                let url = this.generateURL(item);
                await navigator.clipboard.writeText(url);

                addNotification(`URL for Webhook "${item.name}" copied!`, {
                    type: "success"
                });

            } catch (err) {

                addNotification(`Error, could not copy URL: ${err}`, {
                    type: "danger",
                    dismiss: false
                });

                console.error('Error:', err);
            }
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
                            <th scope="col">Name</th>
                            <th scope="col">Timestamps</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="(item, index) in webhooks">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="name"
                                    type="text" />
                            </td>
                            <td>

                                <TimestampsTable :data="item.timestamps" :mappings="{
                                    'created': 'Created',
                                    'updated': 'Updated',
                                    'triggered': 'Triggered'
                                }" />

                            </td>
                            <td>
                                <ActionsButtons :showEdit="true" :showRemove="true" :item="item"
                                    @handleEdit="handleEdit" @handleRemove="handleRemove" @handleJson="handleJson">
                                    <template v-slot:custom>
                                        <a :href="generateURL(item)" class="btn btn-outline-secondary"
                                            tooltip="Copy Webhook URL" flow="down" @click.prevent="copyURL(item)">
                                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                        </a>
                                        <button type="button" class="btn btn-outline-secondary"
                                            tooltip="Trigger Webhook" flow="down" @click="triggerWebhook(item)">
                                            <i class="fa-solid fa-link"></i>
                                        </button>
                                    </template>
                                </ActionsButtons>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
            <template v-slot:add>

                <div class="row mt-3">
                    <div clasS="col-6">
                        <form @submit.prevent="addWebhook">
                            <div class="form-group mb-2">
                                <label>Name</label>
                                <input type="text" name="name" class="form-control bg-dark text-white" />
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

<style scoped>
a.btn-outline-secondary {
    border-left-color: #000 !important;
}
</style>