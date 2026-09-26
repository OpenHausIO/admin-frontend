<script setup>
import dateFormat from "dateformat";
import { getItemById } from "../helper.js";
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
import LabelsInput from "@/components/LabelsInput.vue";
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
        JsonEditor,
        Tabs,
        LabelsInput
    },
    data() {
        return {
            editItem: null,
            tabItems: [{
                name: "Overview",
                id: "overview",
            }/*, {
                name: "Add",
                id: "add",
            }*/],
            json: null,
            showJSONEditor: false,
            showLabelsEditor: false
        };
    },
    computed: {
        devices() {
            return items.devices;
        },
        rooms() {
            return items.rooms;
        }
    },
    methods: {
        triggerUpdate(item) {
            items.update("devices", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Device "${item.name}" updated`, {
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
            items.remove("devices", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Device "${item.name}" removed`, {
                        type: "success"
                    });

                }
            });
        },
        handleClone() { },
        handleJson(item) {
            this.json = item;
            this.showJSONEditor = true;
        },
        onClose() {
            this.json = null;
            this.editItem = null;
            this.showJSONEditor = false;
            this.showLabelsEditor = true;
        },
        onConfirm(item) {
            this.json = null;
            this.editItem = null;
            this.triggerUpdate(item);
        },
        editLabels(item) {
            this.editItem = item._id;
            this.json = item;
            this.showLabelsEditor = true;
        },
    },
});
</script>


<template>
    <div>

        <JsonEditor v-if="!!json && showJSONEditor" :item="json" @onClose="onClose" @onConfirm="onConfirm" />

        <Modal :visible="showLabelsEditor" title="Labels" @close="showLabelsEditor = false" v-bind:item="json"
            @confirm="onConfirm(json); showLabelsEditor = false">
            <template v-slot:body>

                <LabelsInput :data="json.labels" :edit="true" @changed="(data) => { json.labels = data; }"
                    class="w-100" />

            </template>
        </Modal>

        <Tabs v-bind:items="tabItems">
            <template v-slot:overview>
                <div class="table-card table-card-tabbed">
                    <table class="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style="width: 10px">#</th>
                                <th scope="col" style="width: 10px">Icon</th>
                                <th scope="col">Name</th>
                                <!--<th scope="col hide">Manufacturer</th>-->
                                <!--<th scope="col hide">Model</th>-->
                                <th scope="col">Room</th>
                                <th scope="col" style="width:300px">Labels</th>
                                <th scope="col" style="width: 10px">Enabled</th>
                                <th scope="col" style="width: 10px">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-bind:key="item._id" v-for="(item, index) in devices"
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
                                <!--<td class="hide">
                                <EditorProperty v-if="item?.meta"
                                    :enabled="item._id === editItem && settings.expertSettings" :object="item.meta"
                                    prop="manufacturer" type="text" />
                            </td>
                            <td class="hide">
                                <EditorProperty v-if="item?.meta"
                                    :enabled="item._id === editItem && settings.expertSettings" :object="item.meta"
                                    prop="model" type="text" />
                            </td>
                            -->
                                <td>
                                    <EditorProperty :enabled="item._id === editItem" :object="item" prop="room"
                                        type="select" :items="rooms">
                                        <template v-slot:display="{ value }">
                                            {{ getItemById(rooms, value)?.name || "" }}
                                        </template>
                                    </EditorProperty>
                                </td>
                                <td>

                                    <button type="button" class="btn btn-outline-secondary"
                                        :tooltip="item.labels.join(', ')" flow="down" :disabled="item._id !== editItem"
                                        @click="editLabels(item)">
                                        <i class="fa-solid fa-tags"></i>
                                        <span class="badge bg-dark ms-2"
                                            :class="{ 'text-muted': item.labels.length === 0 }">
                                            {{ item.labels.length }}
                                        </span>
                                    </button>

                                </td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" v-bind:checked="item.enabled"
                                            v-model="item.enabled" @change.lazy="triggerUpdate(item)" />
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
            <template v-slot:add>
                <div class="container-fluid">

                    <div class="row">
                        <div class="col">let</div>
                        <div class="col">rig</div>
                    </div>

                </div>
            </template>
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