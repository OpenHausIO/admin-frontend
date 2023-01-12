<script setup>
import store from "../store.js";

import dateFormat from "dateformat";

import Tabs from "@/components/Tabs.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import ActionsButtons from "@/components/ActionsButtons.vue";
</script>

<script>
import { defineComponent } from "vue";

export default defineComponent({
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
        };
    },
    computed: {
        ssdp() {
            return store.state.ssdp;
        },
        timestamps(item) {
            return {
                announced: dateFormat(item.timestamps.announced, "yyyy.mm.dd - HH:MM"),
            };
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
        handleRemove() { },
    },
});
</script>


<template>
    <div>
        <Tabs v-bind:items="tabItems">
            <template v-slot:overview>
                <table class="table text-white">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Description</th>
                            <th scope="col">NT</th>
                            <th scope="col">USN</th>
                            <th scope="col">Headers</th>
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
                            <td>{{ item.nt }}</td>
                            <td>{{ item.usn }}</td>
                            <td>
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
                            <td>
                                <table>
                                    <tr>
                                        <td>Created:</td>
                                        <td>
                                            {{
                                                dateFormat(
                                                    item.timestamps.created || 0,
                                                "yyyy.mm.dd - HH:MM"
                                                                                        )
                                            }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Updated:</td>
                                        <td>
                                            {{
                                                dateFormat(
                                                    item.timestamps.updated || 0,
                                                "yyyy.mm.dd - HH:MM"
                                                                                        )
                                            }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Announced:</td>
                                        <td>
                                            {{
                                                dateFormat(
                                                    item.timestamps.announced || 0,
                                                "yyyy.mm.dd - HH:MM"
                                                                                        )
                                            }}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td>
                                <ActionsButtons :showEdit="true" :showRemove="true" :item="item"
                                    @handleEdit="handleEdit" @handleRemove="handleRemove" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
            <template v-slot:add> Hello from apsdflkasjfdlasdf </template>
        </Tabs>

        <!--ssdp: {{ ssdp }}-->
    </div>
</template>
