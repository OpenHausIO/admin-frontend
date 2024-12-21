<script>
import { defineComponent } from "vue";
import store from "../store.js";

import ActionsButtons from "@/components/ActionsButtons.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import IconSelect from "@/components/IconSelect.vue";
import Tabs from "@/components/Tabs.vue";
import JsonEditor from "@/components/JsonEditor.vue";

import { request } from "../helper";
import { addNotification } from "@/components/Notifications.vue";

export default defineComponent({
    components: {
        ActionsButtons,
        EditorProperty,
        IconSelect,
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
            dynamicSlots: [],
            currentSort: "name",
            currentSortDir: "asc",
            json: null
        };
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
        handleRemove(item) {
            request(`/api/rooms/${item._id}`, {
                method: "DELETE",
            }, (err, data) => {
                if (err || data.error) {

                    addNotification(`Error: ${err || data.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Room "${data.name}" added`, {
                        type: "success"
                    });

                }
            });
        },
        handleClone() { },
        sort(s) {
            //if s == current sort, reverse
            if (s === this.currentSort) {
                this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
            }
            this.currentSort = s;
        },
        addRoom(event) {

            let {
                name,
                floor,
                number,
                icon
            } = event.target.elements;

            console.log("ADD room", name, floor, number, icon)

            request("/api/rooms", {
                method: "PUT",
                body: JSON.stringify({
                    name: name.value || null,
                    floor: floor.value || null,
                    number: number.value || null,
                    icon: icon.value || null
                })
            }, (err, data) => {
                if (err || data.error) {

                    console.error("Could not add room", err || data.error);

                    addNotification(`Error: ${err || data.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Room "${data.name}" added`, {
                        type: "success"
                    });

                    name.value = "";
                    floor.value = "";
                    number.value = "";
                    //icon.value = "";

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

            request(`/api/rooms/${data._id}`, {
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

                    addNotification(`Room item "${data.name}" updated`, {
                        type: "success"
                    });

                }
            });

            this.json = null;
            this.editItem = null;

        }
    },
    mounted() { },
    computed: {
        rooms() {
            return store.state.rooms;
        },
        sortedItems: function () {
            return this.rooms.sort((a, b) => {
                let modifier = 1;
                if (this.currentSortDir === "desc") modifier = -1;
                if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
                if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
                return 0;
            });
        },
    },
});
</script>


<template>
    <div>

        <JsonEditor v-if="!!json" :item="json" @onClose="onClose" @onConfirm="onConfirm" />

        <Tabs v-bind:items="tabItems">
            <!-- OVERVIEW -->
            <template v-slot:overview>
                <table class="table text-white border-secondary">
                    <thead>
                        <tr>
                            <th scope="col" style="width: 10px">#</th>
                            <th scope="col" style="width: 10px">Icon</th>
                            <th scope="col" @click="sort('name')" style="cursor: pointer;">
                                Name
                                <i class="fa-solid fa-filter" style="font-size: 10px"></i>
                            </th>
                            <th scope="col" @click="sort('floor')" style="cursor: pointer;">
                                Floor
                                <i class="fa-solid fa-filter" style="font-size: 10px"></i>
                            </th>
                            <th scope="col">Number</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="(item, index) in sortedItems">
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
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="floor"
                                    type="number" />
                            </td>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="number"
                                    type="number" />
                            </td>
                            <td>
                                <ActionsButtons :showEdit="true" :showInfo="true" :showRemove="true" :item="item"
                                    @handleEdit="handleEdit" @handleInfo="handleInfo" @handleRemove="handleRemove"
                                    @handleJson="handleJson" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
            <!-- OVERVIEW -->
            <!-- ADD-->
            <template v-slot:add>
                <div>
                    <div class="row">
                        <div class="col-6">
                            <form @submit.prevent="addRoom">
                                <div class="form-group mb-2">
                                    <label>Room Name</label>
                                    <input type="text" name="name" class="form-control bg-dark text-white" />
                                </div>
                                <div class="form-group mb-2">
                                    <label>Floor/Level</label>
                                    <input type="number" name="floor" class="form-control bg-dark text-white" />
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
                    </div>
                </div>
            </template>
            <!-- ADD-->
            <!-- CUSTOM SLOTS -->
            <template v-for="slot in dynamicSlots" v-slot:[slot.id]="data" v-bind:key="slot.id">
                <div>{{ data }}</div>
            </template>
            <!-- CUSTOM SLOTS -->
        </Tabs>

        <!--Rooms: {{ rooms }}-->
    </div>
</template>

<style scope>
.nav-link.active {
    color: red !important;
}

/*.btn-group button.btn:not(:first-child):not(:last-child)*/
.btn-group button.btn:not(:first-child) {
    border-left-color: #000 !important;
    /*border-right-color: #000 !important;*/
}
</style>