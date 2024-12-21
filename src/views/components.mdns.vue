<script setup>
import dateFormat from "dateformat";
</script>

<script>
import { defineComponent } from "vue";
import store from "../store.js";

import ActionsButtons from "@/components/ActionsButtons.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import Tabs from "@/components/Tabs.vue";
import JsonEditor from "@/components/JsonEditor.vue";

import { request } from "../helper";
import { addNotification } from "@/components/Notifications.vue";

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
            recordTypes: ["SRV", "PTR", "A", "AAAA"],
            json: null
        };
    },
    computed: {
        items() {
            return store.state.mdns;
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
        handleRemove(item) {
            request(`/api/mdns/${item._id}`, {
                method: "DELETE",
            }, (err, data) => {
                if (err || data.error) {

                    addNotification(`Error: ${err || data.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`MDNS item "${data._id}" removed`, {
                        type: "success"
                    });

                }
            });
        },
        addItem(event) {

            let {
                name,
                type
            } = event.target.elements;

            console.log("ADD MDNS", name, type);

            request("/api/mdns", {
                method: "PUT",
                body: JSON.stringify({
                    name: name.value || null,
                    type: type.value || null,
                })
            }, (err, data) => {
                if (err || data.error) {

                    addNotification(`Error: ${err || data.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`MDNS item "${data._id}" updated`, {
                        type: "success"
                    });

                    name.value = "";
                    type.value = "";

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
        onConfirm(data) {

            request(`/api/mdns/${data._id}`, {
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

                    addNotification(`MDNS item "${data._id}" updated`, {
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
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope="col">Timestamps</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="(item, index) in items">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="name"
                                    type="text" />
                            </td>
                            <td>
                                <select class="form-select bg-dark text-white" v-model="item.type"
                                    v-if="item._id === editItem">
                                    <option :value="type" v-bind:key="type" v-for="type in recordTypes">
                                        {{ type }}
                                    </option>
                                </select>
                                <span v-if="item._id !== editItem"> {{ item.type }}</span>
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
                                        <td>Announced:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.announced || 0, "yyyy.mm.dd - HH:MM") }}
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
            <template v-slot:add>

                <div class="row">
                    <div class="col-6">
                        <form @submit.prevent="addItem">
                            <div class="form-group mb-2">
                                <label>Name</label>
                                <input type="text" name="name" class="form-control bg-dark text-white" />
                            </div>
                            <div class="form-group mb-2">
                                <label>Type</label>
                                <select class="form-select bg-dark text-white" name="type">
                                    <option :value="type" v-bind:key="type" v-for="type in recordTypes">
                                        {{ type }}
                                    </option>
                                </select>
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
