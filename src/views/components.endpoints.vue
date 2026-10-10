<script setup>
import { getItemById } from "../helper.js";
import dateFormat from "dateformat";
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
import { defineComponent } from "vue";

import ActionsButtons from "@/components/ActionsButtons.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import IconSelect from "@/components/IconSelect.vue";
import Tabs from "@/components/Tabs.vue";
import JsonEditor from "@/components/JsonEditor.vue";
import Modal from "@/components/Modal.vue";
import LabelsInput from "@/components/LabelsInput.vue";
import TimestampsTable from "@/components/TimestampsTable.vue";
import RemoteLayoutEditor from "@/components/RemoteLayoutEditor.vue";

import { request } from "../helper";
import { addNotification } from "@/components/Notifications.vue";

import { itemStore } from "../store.js";
import StatesEditor from "../components/StatesEditor.vue";
import CommandsEditor from "../components/CommandsEditor.vue";
const items = itemStore();

export default defineComponent({
    components: {
        IconSelect,
        ActionsButtons,
        EditorProperty,
        JsonEditor,
        Tabs,
        Modal,
        LabelsInput,
        TimestampsTable,
        RemoteLayoutEditor,
        StatesEditor,
        CommandsEditor
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
            json: null,
            modalInfo: {
                show: false
            },
            showJSONEditor: false,
            showRemoteLayoutEditor: false,
            showStatesEditor: false,
            showCommandsEditor: false,
            showLabelsEditor: false
        };
    },
    computed: {
        endpoints() {
            return items.endpoints;
        },
        rooms() {
            return items.rooms;
        },
        devices() {
            return items.devices;
        },
    },
    methods: {
        triggerUpdate(item) {
            items.update("endpoints", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Endpoint "${item.name}" updated`, {
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
        handleInfo() {
            this.modalInfo.show = true;
        },
        handleRemove(item) {
            items.remove("endpoints", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Endpoint "${item.name}" removed`, {
                        type: "success"
                    });

                }
            });
        },
        handleClone() { },
        handleJson(item) {
            //this.editItem = item._id
            this.json = item;
            this.showJSONEditor = true;
        },
        onClose() {
            this.json = null;
            //this.editItem = null;
            this.showJSONEditor = false;
        },
        onConfirm(item) {
            console.log("onConfirm", item)
            this.json = null;
            this.editItem = null;
            this.showJSONEditor = false;
            this.triggerUpdate(item);
        },
        editPages(item) {
            this.editItem = item._id;
            this.json = item;
            this.showRemoteLayoutEditor = true;
        },
        editStates(item) {
            this.editItem = item._id;
            this.json = item;
            this.showStatesEditor = true;
        },
        editCommands(item) {
            this.editItem = item._id;
            this.json = item;
            this.showCommandsEditor = true;
        },
        editLabels(item) {
            this.editItem = item._id;
            this.json = item;
            this.showLabelsEditor = true
        },
        saveRemoteLayoutEditor() {
            this.showRemoteLayoutEditor = false;
            this.triggerUpdate(this.json);
            this.json = null;
            this.editItem = null;
        },
        saveStatesEditor() {
            this.showStatesEditor = false;
            this.triggerUpdate(this.json);
            this.json = null;
            this.editItem = null;
        },
        saveCommandsEditor() {
            this.showCommandsEditor = false;
            this.triggerUpdate(this.json);
            this.json = null;
            this.editItem = null;
        },
        closeRemoteLayoutEditor() {
            this.showRemoteLayoutEditor = false;
            //this.editItem = null;
        },
        closeStatesEditor() {
            this.showStatesEditor = false;
            //this.editItem = null;
        },
        closeCommandsEditor() {
            this.showCommandsEditor = false;
            //this.editItem = null;
        }
    },
});
</script>


<template>
    <div>

        <JsonEditor v-if="!!json && showJSONEditor" :item="json" @onClose="onClose" @onConfirm="onConfirm" />

        <RemoteLayoutEditor v-if="!!editItem && showRemoteLayoutEditor" :item="json" @save="saveRemoteLayoutEditor"
            @close="closeRemoteLayoutEditor" />

        <StatesEditor v-if="!!editItem && showStatesEditor" :item="json" @save="saveStatesEditor"
            @close="closeStatesEditor" />

        <CommandsEditor v-if="!!editItem && showCommandsEditor" :item="json" @save="saveCommandsEditor"
            @close="closeCommandsEditor" />

        <!--
        <Modal  :visible="modalInfo.show" title="Information" @close="modalInfo.show = false" v-bind:item="json">
            <template v-slot:body>
                {{ json.states.map(({ alias, value }) => { return `${alias}=${value}`; }) }}
            </template>
</Modal>
-->


        <Modal :visible="showLabelsEditor" title="Labels" @close="showLabelsEditor = false" v-bind:item="json"
            @confirm="onConfirm(json); showLabelsEditor = false">
            <template v-slot:body>

                <LabelsInput :data="json.labels" :edit="true" @changed="(data) => { json.labels = data; }"
                    class="w-100" />

            </template>
        </Modal>

        <Tabs v-bind:items="tabItems">
            <template v-slot:overview>

                <div class="d-md-none hide">
                    <div v-for="endpoint in endpoints" :key="endpoint._id" class="mobile-item mb-2 py-3"
                        style="border-bottom: 2px solid #000">
                        <div class="d-flex align-items-center gap-2">
                            <i :class="endpoint.icon" class="fa-fw"></i>
                            <span class="fw-semibold">{{ endpoint.name }}</span>
                            <div class="form-check form-switch ms-auto mb-0">
                                <input class="form-check-input" type="checkbox" v-model="endpoint.enabled">
                            </div>
                        </div>
                        <div class="small text-body-secondary mt-1">
                            {{ getItemById(rooms, endpoint.room)?.name }}
                            <span>·</span>
                            {{ getItemById(devices, endpoint.device)?.name }}
                        </div>
                        <div class="d-flex gap-2 mt-2">
                            <button class="btn btn-sm btn-outline-secondary flex-grow-1" @click="edit(endpoint)">
                                <i class="fa-solid fa-pen-to-square"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-outline-danger" @click="remove(endpoint)">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="table-card table-card-tabbed">
                    <table class="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style="width: 10px">#</th>
                                <th scope="col" style="width: 10px">Icon</th>
                                <th scope="col">Name</th>
                                <th scope="col">Device</th>
                                <th scope="col">Room</th>
                                <th scope="col">States</th>
                                <th scope="col">Commands</th>
                                <th scope="col">Layouts</th>
                                <th scope="col" style="width: 100px">Labels</th>
                                <!--<th scope="col" style="width: 10px">Timestamps</th>-->
                                <th scope="col" style="width: 10px">Enabled</th>
                                <th scope="col" style="width: 10px">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-bind:key="item._id" v-for="(item, index) in endpoints"
                                :class="{ 'endpoint-disabled': !item.enabled }">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>
                                    <EditorProperty :enabled="item._id === editItem" :object="item" prop="icon"
                                        type="text">
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
                                    <EditorProperty :enabled="item._id === editItem && settings.expertSettings"
                                        :object="item" prop="device" type="select" :items="devices">
                                        <template v-slot:display="{ value }">
                                            <span v-if="getItemById(devices, value)?.name">
                                                {{ getItemById(devices, value).name }}
                                            </span>
                                            <span class="badge badge-danger badge-outline badge-flash" v-else>
                                                device not set
                                            </span>
                                        </template>
                                    </EditorProperty>
                                </td>
                                <td>
                                    <EditorProperty :enabled="item._id === editItem" :object="item" prop="room"
                                        type="select" :items="rooms">
                                        <template v-slot:display="{ value }">
                                            {{ getItemById(rooms, value)?.name || "" }}
                                        </template>
                                    </EditorProperty>
                                </td>
                                <td>

                                    <button class="btn btn-outline-secondary" :disabled="item._id !== editItem"
                                        @click="editStates(item)">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>

                                </td>
                                <td>

                                    <button class="btn btn-outline-secondary" :disabled="item._id !== editItem"
                                        @click="editCommands(item)">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>

                                </td>
                                <td>

                                    <button class="btn btn-outline-secondary" :disabled="item._id !== editItem"
                                        @click="editPages(item)">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>

                                </td>
                                <td>


                                    <!--
                                    <button type="button" class="btn btn-outline-secondary position-relative"
                                        :tooltip="item.labels.join(', ')" flow="down">
                                        <i class="fa-solid fa-tags"></i>
                                        <span
                                            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                                            {{ item.labels.length }}
                                        </span>
                                    </button>
-->


                                    <button type="button" class="btn btn-outline-secondary"
                                        :tooltip="item.labels.join(', ')" flow="down" :disabled="item._id !== editItem"
                                        @click="editLabels(item)">
                                        <i class="fa-solid fa-tags"></i>
                                        <span class="badge bg-dark ms-2"
                                            :class="{ 'text-muted': item.labels.length === 0 }">
                                            {{ item.labels.length }}
                                        </span>
                                    </button>

                                    <!--
                                    <button class="btn btn-outline-secondary" @click="openLabels(endpoint)"
                                        :title="item.labels.join(', ')">
                                        <i class="fa-solid fa-tags"></i>
                                        <span v-if="item.labels.length" class="badge rounded-pill text-bg-primary ms-1">
                                            {{ item.labels.length }}
                                        </span>
                                    </button>
                                    -->


                                </td>
                                <!--
                                <td>

                                    <LabelsInput :data="item.labels" :edit="item._id === editItem"
                                        @changed="(data) => { item.labels = data; }" />

                                </td>
                                -->
                                <!--
                            <td>

                                <TimestampsTable :data="item.timestamps" :mappings="{
                                    'created': 'Created',
                                    'updated': 'Updated'
                                }" />

                            </td>
                            -->
                                <td>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" v-bind:checked="item.enabled"
                                            v-model="item.enabled" @change="triggerUpdate(item)" />
                                    </div>
                                </td>
                                <td>
                                    <ActionsButtons :showEdit="true" :showInfo="true" :showRemove="true" :item="item"
                                        @handleEdit="handleEdit" @handleRemove="handleRemove" @handleInfo="handleInfo"
                                        @handleJson="handleJson" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-slot:add> Hello from apsdflkasjfdlasdf </template>
        </Tabs>

        <!--Rooms: {{ rooms }}-->
    </div>
</template>

<style scoped>
tr.endpoint-disabled,
tr.endpoint-disabled>*,
tr.endpoint-disabled td * {
    color: var(--bs-gray-800);
}
</style>