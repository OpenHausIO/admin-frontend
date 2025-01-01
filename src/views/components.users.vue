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

import { itemStore, settingsStore } from "../store.js";
const items = itemStore();
const settings = settingsStore();

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
    methods: {
        triggerUpdate(item) {
            items.update("users", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`User "${item.name}" updated`, {
                        type: "success"
                    });

                }
            });
        },
        tokens(arr, length) {
            console.log("Tokens arr", arr);
            return arr.map((str) => {
                return `${str.substr(0, length)}...${str.substr(-length, str.length)}`;
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
            items.remove("users", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`User "${item.name}" removed`, {
                        type: "success"
                    });

                }
            });
        },
        handleClone() { },
        addItem(event) {

            let {
                name,
                email,
                password,
                admin
            } = event.target.elements;

            console.log("ADD item", name, email, password, admin.value);

            request("/api/users", {
                method: "PUT",
                body: JSON.stringify({
                    name: name.value || null,
                    email: email.value || null,
                    password: password.value || null,
                    admin: admin.value === "on" || false
                })
            }, (err, data) => {
                if (err || data.error) {

                    addNotification(`Error: ${err || data.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`User "${data.name}" added`, {
                        type: "success"
                    });

                    name.value = "";
                    email.value = "";
                    password.value = "";
                    admin.value = "off";

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
    computed: {
        users() {
            return items.users;
        },
        settings() {
            return settings;
        },
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
                            <th scope="col">E-Mail</th>
                            <th scope="col">Tokens</th>
                            <th scope="col">Timestamps</th>
                            <th scope="col" style="width: 10px">Admin</th>
                            <th scope="col" style="width: 10px">Enabled</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="(item, index) in users">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="name"
                                    type="text" />
                            </td>
                            <td>
                                <EditorProperty :enabled="item._id === editItem && settings.expertSettings"
                                    :object="item" prop="email" type="text" />
                            </td>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="tokens"
                                    :disabled="true" type="textarea">
                                    <template v-slot:editor="{ value }">
                                        <textarea rows="3" width="500px" class="form-control bg-dark text-white"
                                            v-bind:key="index" v-for="(token, index) in value" readonly
                                            :value="token"></textarea>
                                    </template>
                                    <template v-slot:display="{ value }">
                                        <ul style="padding-left: 1rem">
                                            <li v-bind:key="index" v-for="(intent, index) in tokens(value, 20)">
                                                {{ intent }}
                                            </li>
                                        </ul>
                                    </template>
                                </EditorProperty>
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
                                    <tr>
                                        <td>Login:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.login, settings.dateformat) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Logout:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.logout, settings.dateformat) }}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" v-bind:checked="item.admin"
                                        v-model="item.admin" />
                                </div>
                            </td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" v-bind:checked="item.enabled"
                                        v-model="item.enabled" />
                                </div>
                            </td>
                            <td>
                                <ActionsButtons :showEdit="true" :showInfo="true" :showRemove="true" :item="item"
                                    @handleEdit="handleEdit" @handleInfo="handleInfo" @handleRemove="handleRemove"
                                    @handleJson="handleJson">
                                    <template v-slot:custom>
                                        <button type="button" class="btn btn-outline-warning" :disabled="index === 2"
                                            tooltip="Logout User" flow="down">
                                            <i class="fa-solid fa-right-from-bracket"></i>
                                        </button>
                                    </template>
                                </ActionsButtons>
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
                                <label>E-Mail</label>
                                <input type="text" name="email" class="form-control bg-dark text-white" />
                            </div>
                            <div class="form-group mb-2">
                                <label>Password</label>
                                <input type="password" name="password" class="form-control bg-dark text-white" />
                            </div>
                            <div class="form-check form-switch">
                                <label>
                                    <input class="form-check-input" name="admin" type="checkbox" />
                                    Admin
                                </label>
                            </div>
                            <button type="submit" class="btn btn-outline-primary">
                                Save
                            </button>
                        </form>
                    </div>
                </div>

            </template>
        </Tabs>

        <!--users: {{ users }}-->
    </div>
</template>
