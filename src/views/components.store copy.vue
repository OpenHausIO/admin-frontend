<script setup>
import { getItemByProperty } from "../helper.js";
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
            return store.state.store;
        },
    },
    methods: {
        handleEdit(item) {
            if (this.editItem === item._id) {
                this.editItem = null;
            } else {
                this.editItem = item._id;
            }
        },
        handleInfo() { },
        handleRemove() { },
        handleJson(item) {
            this.json = item;
        },
        onClose() {
            this.json = null;
            this.editItem = null;
        },
        onConfirm(data) {

            request(`/api/store/${data._id}`, {
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

                    addNotification(`Store item "${data.name}" updated`, {
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
                            <th scope="col">Config</th>
                            <th scope="col">Namespace (Item)</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="item in config">
                            <td>

                                {{ item }}

                                <table class="">
                                    <thead>
                                        <tr>
                                            <th scope="col">Key</th>
                                            <th scope="col">Value</th>
                                            <th scope="col">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-bind:key="index" v-for="(config, index) in item.config">
                                            <td>
                                                {{ config.key }} =
                                            </td>
                                            <td>
                                                {{ config.value }}
                                            </td>
                                            <td>
                                                {{ config.description }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </td>
                            <td>{{ item.namespace }} ({{ item.item }})</td>
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
