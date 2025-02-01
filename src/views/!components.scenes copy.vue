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
import Modal from "@/components/Modal.vue";

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
        JsonEditor,
        Modal
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
            json: null,
            addModal: {
                show: false,
                items: [],
                page: ""
            }
        };
    },
    computed: {
        scenes() {
            return items.scenes;
        },
        endpoints() {
            return items.endpoints.filter(({ enabled, commands }) => {
                return enabled && commands?.length > 0;
            });
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
        },
        getDeviceNameById(_id) {
            return items.devices.find((item) => {
                return item._id === _id;
            })?.name;
        },
        getEndpointNameById(_id) {
            return items.endpoints.find((item) => {
                return item._id === _id;
            })?.name;
        },
        getCommandNameById(endpoint, cmd) {

            endpoint = items.endpoints.find((item) => {
                return item._id === endpoint;
            });

            if (!endpoint) {
                return;
            }

            cmd = endpoint.commands.find((item) => {
                return item._id === cmd;
            });

            if (!cmd) {
                return;
            }

            return cmd.name;

        },
        openAddModal(page) {
            this.addModal.page = page;
            this.addModal.show = true;
        },
        closeAddModal() {
            this.addModal.show = false;
            this.addModal.items = [];
        },
        addCommandToScene() {

            let selectedOption = this.$refs.sourceSelect.value;
            console.log("SelectOption", selectedOption)

            if (selectedOption) {
                const parsedOption = JSON.parse(selectedOption);
                this.addModal.items.push(parsedOption);
            }

        },
        removeCommandFromScene() {

            let targetSelect = this.$refs.targetSelect.value;
            console.log("targetSelect", targetSelect)

            if (targetSelect) {

                let index = this.addModal.items.findIndex((item) => {
                    console.log("find Index", targetSelect, item)
                    return targetSelect === item.command;
                });

                if (index >= 0) {
                    this.addModal.items.splice(index, 1);
                }

            }

        },
        moveIndexUp() {

            let targetSelect = this.$refs.targetSelect.value;
            let arr = this.addModal.items;

            if (targetSelect) {

                let index = arr.findIndex((item) => {
                    return targetSelect === item.command;
                });

                let element = arr[index];
                let makro = arr[index - 1];

                if (!element || !makro) {
                    return;
                }

                arr.splice(index, 1);
                arr.splice(index - 1, 0, element);

                this.$refs.targetSelect.value = makro.command;

            }

        },
        moveIndexDown() {

            let targetSelect = this.$refs.targetSelect.value;
            let arr = this.addModal.items;

            if (targetSelect) {

                let index = arr.findIndex((item) => {
                    return targetSelect === item.command;
                });

                let element = arr[index];
                let makro = arr[index + 1];

                if (!element || !makro) {
                    return;
                }

                arr.splice(index, 1);
                arr.splice(index + 1, 0, element);

                this.$refs.targetSelect.value = makro.command;

            }

        }
    },
});
</script>

<template>
    <div>

        <JsonEditor v-if="!!json" :item="json" @onClose="onClose" @onConfirm="onConfirm" />

        <Modal :xl="true" :visible="addModal.show" @close="closeAddModal">
            <template #body>
                <div class="row">
                    <div class="col">

                        <select class="form-select bg-dark border-primary h-100" size="20" ref="targetSelect">
                            <optgroup
                                v-bind:label="getEndpointNameById(makro.endpoint) + ' (' + getDeviceNameById(makro.device) + ')'"
                                v-for="makro in addModal.items">
                                <option v-bind:value="makro.command">
                                    {{ getCommandNameById(makro.endpoint, makro.command) }}
                                </option>
                            </optgroup>
                        </select>

                    </div>
                    <div class="col-2 m-auto">

                        <button class="btn btn-outline-light d-block w-100" @click="addCommandToScene">
                            <i class="fa-solid fa-plus d-block"></i>
                            Add
                        </button>
                        <button class="btn btn-outline-light d-block w-100 mt-4" @click="removeCommandFromScene">
                            <i class="fa-solid fa-minus d-block"></i>
                            Remove
                        </button>
                        <button class="btn btn-outline-light d-block w-100 mt-4" @click="moveIndexUp">
                            <i class="fa-solid fa-arrow-up d-block"></i>
                            Move Up
                        </button>
                        <button class="btn btn-outline-light d-block w-100 mt-4" @click="moveIndexDown">
                            <i class="fa-solid fa-arrow-down d-block"></i>
                            Move Down
                        </button>

                    </div>
                    <div class="col">

                        <select class="form-select bg-dark text-white border-primary mb-3 hide">
                            <option value="timer">Timer</option>
                            <option value="command">Command</option>
                            <option value="scene" selected>Scene</option>
                        </select>

                        <select class="form-select bg-dark border-primary h-100" size="20" ref="sourceSelect">
                            <optgroup v-bind:label="endpoint.name + ' (' + getDeviceNameById(endpoint.device) + ')'"
                                v-for="endpoint in endpoints">
                                <option
                                    v-bind:value="JSON.stringify({ command: command._id, endpoint: endpoint._id, device: endpoint.device })"
                                    :key="command._id" v-for="command in endpoint.commands">
                                    {{ command.name }}
                                </option>
                            </optgroup>
                        </select>

                    </div>
                </div>
            </template>
        </Modal>

        <Tabs v-bind:items="tabItems">
            <template v-slot:overview>
                <table class="table text-white">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Icon</th>
                            <th scope="col">Name</th>
                            <th scope="col" style="width: 300px">Timestmaps</th>
                            <th scope="col">Visible</th>
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
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" v-bind:checked="item.visible"
                                        v-model="item.visible" @change.lazy="triggerUpdate(item)" />
                                </div>
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
            <template v-slot:add>

                <div class="row mt-3">
                    <div clasS="col">
                        <form @submit.prevent="addScene">
                            <div class="form-group mb-2">
                                <label>Name</label>
                                <input type="text" name="name" class="form-control bg-dark text-white" />
                            </div>
                            <div class="form-group mb-2">
                                <label>Floor/Level</label>
                                <button @click="openAddModal('commands')">Add Commands</button>
                            </div>
                            <div class="form-group mb-2">
                                <label>Number</label>
                                <input type="number" name="number" class="form-control bg-dark text-white" />
                            </div>
                            <div class="form-group mb-2">
                                <label>Icon</label>
                                <input type="text" name="icon" class="form-control bg-dark text-white"
                                    value="fa-regular fa-lightbulb" />
                            </div>
                            <button type="submit" class="btn btn-outline-primary">
                                Save
                            </button>
                        </form>
                    </div>
                    <div class="col">



                    </div>
                </div>

            </template>
        </Tabs>
    </div>
</template>


<style>
/*
select {
    /*
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    *
    background-color: red;
}

optgroup {
    background-color: yellow;
}

option {
    background-color: green;
}

option:focus {
    background-color: #000;
}
    */
</style>