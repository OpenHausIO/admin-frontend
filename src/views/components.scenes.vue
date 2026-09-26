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
import MakroEditor from "@/components/MakroEditor.vue";
import TriggerEditor from "@/components/TriggerEditor.vue";
import TimestampsTable from "@/components/TimestampsTable.vue";

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
        MakroEditor,
        TriggerEditor,
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
            json: null,
            showMakrosModal: false,
            sourceOptions: [],
            targetOptions: [],
            showMakrosModal: false,
            showTriggersModal: false,
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
        editTriggers(item) {
            this.editItem = item;
            this.showTriggersModal = true;
        },
        saveMakros(makros) {

            console.log("Makros array", makros);

            this.editItem.makros = makros;
            this.triggerUpdate(this.editItem);

            this.editItem = null;
            this.showMakrosModal = false;

        },
        saveTriggers(triggers) {

            console.log("Triggers array", triggers);

            this.editItem.triggers = triggers;
            this.triggerUpdate(this.editItem);

            this.editItem = null;
            this.showTriggersModal = false;

        },
        addScene(event) {

            let { name } = event.target.elements;

            items.add("scenes", {
                name: name.value || null,
                icon: "fa-solid fa-clone"
            }, (err, data) => {
                if (err) {

                    addNotification(`Error: ${err || data.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Scene "${data.name}" added`, {
                        type: "success"
                    });

                    name.value = "";
                    //icon.value = "";

                }
            });

        }
    }
});
</script>

<template>
    <div>

        <JsonEditor v-if="!!json" :item="json" @onClose="onClose" @onConfirm="onConfirm" />

        <!-- Why is the :key here needed, this re-renders the compnent and "messes up" the source selection target-->
        <MakroEditor v-if="editItem && showMakrosModal" @close="showMakrosModal = false" @save="saveMakros"
            :scene="editItem" />

        <TriggerEditor v-if="editItem && showTriggersModal" @close="showTriggersModal = false" @save="saveTriggers"
            :scene="editItem" />


        <Tabs v-bind:items="tabItems">
            <template v-slot:overview>
                <div class="table-card table-card-tabbed">
                    <table class="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Icon</th>
                                <th scope="col">Name</th>
                                <th scope="col">Makros</th>
                                <th scope="col">Triggers</th>
                                <th scope="col">States</th>
                                <th scope="col" style="width: 300px">Timestmaps</th>
                                <th scope="col">Visible</th>
                                <th scope="col">Enabled</th>
                                <th scope="col" style="width: 10px">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-bind:key="item._id" v-for="(item, index) in scenes">
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
                                        <tbody>
                                            <tr>
                                                <td>Running:</td>
                                                <td> {{ item.states.running }} </td>
                                            </tr>
                                            <tr>
                                                <td>Aborted:</td>
                                                <td> {{ item.states.aborted }}</td>
                                            </tr>
                                            <tr>
                                                <td>Finished:</td>
                                                <td> {{ item.states.finished }}</td>
                                            </tr>
                                            <tr>
                                                <td>Index:</td>
                                                <td>{{ item.states.index }}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </td>
                                <td>

                                    <TimestampsTable :data="item.timestamps" :mappings="{
                                        'created': 'Created',
                                        'updated': 'Updated',
                                        'started': 'Started',
                                        'aborted': 'Aborted',
                                        'finished': 'Finished'
                                    }" />

                                </td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" v-bind:checked="item.visible"
                                            v-model="item.visible" @change.lazy="triggerUpdate(item)" />
                                    </div>
                                </td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox"
                                            v-bind:checked="item.enabled ?? true" v-model="item.enabled"
                                            @change.lazy="triggerUpdate(item)" />
                                    </div>
                                </td>
                                <td>
                                    <ActionsButtons :showEdit="true" :showRemove="true" :item="item"
                                        @handleEdit="handleEdit" @handleRemove="handleRemove" @handleJson="handleJson">
                                        <template v-slot:custom>
                                            <button type="button" class="btn btn-outline-secondary"
                                                tooltip="Trigger scene" flow="down" @click="triggerScene(item)">
                                                <i class="fa-solid fa-eye"></i>
                                            </button>
                                            <button type="button" class="btn btn-outline-secondary"
                                                tooltip="Abort scene" flow="down" @click="abortScene(item)">
                                                <i class="fa-solid fa-eye-slash"></i>
                                            </button>
                                        </template>
                                    </ActionsButtons>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-slot:add>

                <div class="row mt-3">
                    <div clasS="col-6">
                        <form @submit.prevent="addScene">
                            <div class="form-group mb-2">
                                <label>Name</label>
                                <input type="text" name="name" class="form-control bg-dark text-white" />
                            </div>
                            <div class="form-group mb-2 hide">
                                <label>Icon</label>
                                <input type="text" name="icon" class="form-control bg-dark text-white" />
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