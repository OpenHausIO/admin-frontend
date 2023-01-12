<script setup>
import store from "../store.js";

import Tabs from "@/components/Tabs.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import ActionsButtons from "@/components/ActionsButtons.vue";
import IconSelect from "@/components/IconSelect.vue";
</script>

<script>
import { defineComponent } from "vue";
import { request } from "../helper";

import { useNotificationStore } from '@dafcoe/vue-notification';
const { setNotification } = useNotificationStore();

export default defineComponent({
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

                    console.error("Could not remove room", err || data.error);

                    setNotification({
                        "message": `Error: ${err || data.error}`,
                        "type": "alert",
                        "showIcon": true,
                        "dismiss": {
                            "manually": true,
                            "automatically": true
                        },
                        "showDurationProgress": true,
                        "appearance": "dark"
                    });

                } else {

                    setNotification({
                        "message": `Room "${data.name}" removed`,
                        "type": "success",
                        "showIcon": true,
                        "dismiss": {
                            "manually": true,
                            "automatically": true
                        },
                        "showDurationProgress": true,
                        "appearance": "dark"
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

                    setNotification({
                        "message": `Error: ${err || data.error}`,
                        "type": "alert",
                        "showIcon": true,
                        "dismiss": {
                            "manually": true,
                            "automatically": true
                        },
                        "showDurationProgress": true,
                        "appearance": "dark"
                    });

                } else {

                    setNotification({
                        "message": `Room "${data.name}" added`,
                        "type": "success",
                        "showIcon": true,
                        "dismiss": {
                            "manually": true,
                            "automatically": true
                        },
                        "showDurationProgress": true,
                        "appearance": "dark"
                    });

                    name.value = "";
                    floor.value = "";
                    number.value = "";
                    //icon.value = "";

                }
            });

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
        <Tabs v-bind:items="tabItems">
            <!-- OVERVIEW -->
            <template v-slot:overview>
                <table class="table text-white border-secondary">
                    <thead>
                        <tr>
                            <th scope="col" style="width: 10px">#</th>
                            <th scope="col" style="width: 10px">Icon</th>
                            <th scope="col" @click="sort('name')">Name</th>
                            <th scope="col" @click="sort('floor')">Floor</th>
                            <th scope="col">Number</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="(item, index) in rooms">
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
                                    @handleClone="handleClone" />
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