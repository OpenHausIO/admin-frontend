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
//import Modal from "@/components/Modal.vue";
import SelectionOrder from "@/components/SelectionOrder.vue";

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
        //Modal,
        SelectionOrder
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
            showMakrosModal: false,
            sourceOptions: [],
            targetOptions: [],
            showMakrosModal: false,
            triggerSelectionTargets: []
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
        },
        selectionOrderItems() {

            /*
                        sourceOptions: [
                            {
                                key: 'group1',
                                label: 'Group 1',
                                options: [
                                    { key: 'item1', label: 'Item 1' },
                                    { key: 'item2', label: 'Item 2' },
                                    { key: 'item3', label: 'Item 3' }
                                ],
                            },
                            {
                                key: 'group2',
                                label: 'Group 2',
                                options: [
                                    { key: 'item1', label: 'Item 1' },
                                    { key: 'item2', label: 'Item 2' },
                                    { key: 'item3', label: 'Item 3' },
                                    { key: 'item4', label: 'Item 4' },
                                ],
                            },
                            {
                                key: 'group3',
                                label: 'Group 3',
                                options: [
                                    { key: 'item1', label: 'Item 1' },
                                    { key: 'item2', label: 'Item 2' },
                                ],
                            },
                        ]
            */

            return this.endpoints.map((endpoint) => {
                return {
                    key: endpoint._id,
                    label: `${endpoint.name} (${this.getDeviceById(endpoint.device)?.name})`,
                    options: endpoint.commands.map((command) => {
                        return {
                            key: command._id,
                            label: command.name
                        };
                    })
                };
            });

        },
        targetOrderItems() {
            if (this.editItem && this.editItem?.makros) {
                /*
                                sourceOptions: [
                                    {
                                        key: 'group1',
                                        label: 'Group 1',
                                        options: [
                                            { key: 'item1', label: 'Item 1' },
                                            { key: 'item2', label: 'Item 2' },
                                            { key: 'item3', label: 'Item 3' }
                                        ],
                                    },
                                    {
                                        key: 'group2',
                                        label: 'Group 2',
                                        options: [
                                            { key: 'item1', label: 'Item 1' },
                                            { key: 'item2', label: 'Item 2' },
                                            { key: 'item3', label: 'Item 3' },
                                            { key: 'item4', label: 'Item 4' },
                                        ],
                                    },
                                    {
                                        key: 'group3',
                                        label: 'Group 3',
                                        options: [
                                            { key: 'item1', label: 'Item 1' },
                                            { key: 'item2', label: 'Item 2' },
                                        ],
                                    },
                                ]                
                */

                console.log("editItem changed", this.editItem)

                return this.editItem.makros.filter(({ type }) => {
                    return type === "command";
                }).map(({ command, endpoint }) => {

                    // get endpoint by id = endpoint
                    // get device by id = endpoint.device
                    // options[] = command...

                    let { _id, name, device, commands } = this.getEndpointById(endpoint);
                    device = this.getDeviceById(device);
                    command = commands.find((cmd) => {
                        return cmd._id === command;
                    })

                    return {
                        key: _id,
                        label: `${name} (${device.name})`,
                        options: [{
                            key: command._id,
                            label: command.name
                        }]
                    };

                });

            } else {
                return []
            }
        },
        triggerSelectionSources() {

            let webhookOptions = items.webhooks.map((webhook) => {
                return {
                    key: webhook._id,
                    label: webhook.name
                }
            });

            let stateOptions = items.endpoints.filter(({ states }) => {
                return states.length > 0;
            }).map(({ _id, name, states }) => {

                return states.map((state) => {
                    return {
                        key: _id,
                        label: `${name} - ${state.name}`
                    }
                });

            }).flat();

            return [{
                key: "webhook",
                label: "Webhook",
                options: webhookOptions
            }, {
                key: "cronjob",
                label: "Cronjob",
                options: [{
                    key: "cronjob",
                    label: "Cronjob"
                }]
            }, {
                key: "states",
                label: "States",
                options: stateOptions
            }];

        }
    },
    methods: {
        triggerUpdate(item) {
            items.update("scenes", item, (err) => {
                if (err) {

                    console.error(err);

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Scene "${item.name}" updated`, {
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
        getDeviceById(_id) {
            return items.devices.find((item) => {
                return item._id === _id;
            });
        },
        getEndpointById(_id) {
            return items.endpoints.find((item) => {
                return item._id === _id;
            });
        },
        openAddModal() {
            this.showMakrosModal = true;
        },
        closeAddModal() {
            this.showMakrosModal = false;
        },
        editMakros(item) {
            this.editItem = item;
            this.showMakrosModal = true;
        },
        saveMakros() {

            let makros = this.targetOrderItems.map(({ key, options }) => {
                return options.map((option) => {

                    // key = endpoint _id
                    // option.key = command _id

                    return {
                        type: "command",
                        endpoint: key,
                        command: option.key,
                        // _id
                        //enabled: true
                    }

                });
            }).flat();

            console.log("Makros array", makros);

            this.editItem.makros = makros;
            this.triggerUpdate(this.editItem);

            this.editItem = null;
            this.showMakrosModal = false;

        },
        editTriggers(item) {
            this.editItem = item;
            this.showTriggersModal = true;
        },
        saveTriggers() {

            let triggers = this.triggerSelectionTargets.map(({ key, options }) => {
                if (key === "cronjob") {

                    return {
                        type: "cronjob",
                        params: {
                            cron: "0 0 0 0 0"
                        }
                    };

                } else if (key === "scenes") {

                    // TODO: implement
                    return {
                        type: "scenes",
                    };

                } else if (key === "webhook") {

                    return {
                        type: "webhook",
                        params: {
                            _id: null
                        }
                    };

                }
            });

            console.log("Triggers array", triggers);

            this.editItem.triggers = triggers;
            this.triggerUpdate(this.editItem);

        }
    },
});
</script>

<template>
    <div>

        <JsonEditor v-if="!!json" :item="json" @onClose="onClose" @onConfirm="onConfirm" />

        <!-- Why is the :key here needed, this re-renders the compnent and "messes up" the source selection target-->
        <SelectionOrder title="Command Makros" :show="showMakrosModal" :key="targetOptions.length"
            @close="showMakrosModal = false" @save="saveMakros" :sourceOptions="selectionOrderItems"
            :targetOptions="targetOrderItems" />

        <SelectionOrder title="Scene Triggers" :show="showTriggersModal" :key="triggerSelectionTargets.length"
            @close="showTriggersModal = false" @save="saveTriggers" :sourceOptions="triggerSelectionSources"
            :targetOptions="triggerSelectionTargets" />

        <Tabs v-bind:items="tabItems">
            <template v-slot:overview>
                <table class="table text-white">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Icon</th>
                            <th scope="col">Name</th>
                            <th scope="col">Makros</th>
                            <th scope="col">Triggers</th>
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

                                <button class="btn btn-outline-secondary" :disabled="item._id !== editItem"
                                    @click="editMakros(item)">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>

                            </td>
                            <td>

                                <button class="btn btn-outline-secondary" :disabled="item._id !== editItem"
                                    @click="editTriggers(item)">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>

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