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
                id: "add",
            }],
            json: null
        };
    },
    computed: {
        ssdp() {
            return store.state.ssdp;
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
            request(`/api/ssdp/${item._id}`, {
                method: "DELETE",
            }, (err, data) => {
                if (err || data.error) {

                    addNotification(`Error: ${err || data.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`SSDP item "${data._id}" removed`, {
                        type: "success"
                    });

                }
            });
        },
        addItem(event) {

            let {
                description,
                nt,
                usn,
            } = event.target.elements;

            console.log("ADD ssdp", description, nt, usn)

            request("/api/ssdp", {
                method: "PUT",
                body: JSON.stringify({
                    description: description.value || null,
                    nt: nt.value || null,
                    usn: usn.value || null,
                })
            }, (err, data) => {
                if (err || data.error) {

                    addNotification(`Error: ${err || data.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`SSDP item "${data._id}" added`, {
                        type: "success"
                    });

                    description.value = "";
                    nt.value = "";
                    usn.value = "";

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

            request(`/api/ssdp/${data._id}`, {
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

                    addNotification(`SSDP item "${data.name}" updated`, {
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
                            <th scope="col">Description</th>
                            <th scope="col">NT</th>
                            <th scope="col">USN</th>
                            <!--<th scope="col">Headers</th>-->
                            <th scope="col">Timestamps</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="(item, index) in ssdp">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="description"
                                    type="text" />
                            </td>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="nt" type="text" />
                            </td>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="usn"
                                    type="text" />
                            </td>
                            <!--
                            <td class="hide">
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="headers"
                                    type="textarea">
                                    <template v-slot:display>
                                        <ul style="padding-left: 1rem">
                                            <li v-bind:key="index" v-for="(header, index) in item.headers">
                                                {{ header }}
                                            </li>
                                        </ul>
                                    </template>
</EditorProperty>
</td>
-->
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
                                <label>Description</label>
                                <input type="text" name="description" class="form-control bg-dark text-white" />
                            </div>
                            <div class="form-group mb-2">
                                <label>NT</label>
                                <input type="text" name="nt" class="form-control bg-dark text-white" />
                            </div>
                            <div class="form-group mb-2">
                                <label>USN</label>
                                <input type="text" name="usn" class="form-control bg-dark text-white" />
                            </div>
                            <button type="submit" class="btn btn-outline-primary">
                                Save
                            </button>
                        </form>
                    </div>
                </div>

            </template>
        </Tabs>

        <!--ssdp: {{ ssdp }}-->
    </div>
</template>
