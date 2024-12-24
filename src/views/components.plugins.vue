<script>
import { defineComponent } from "vue";
import { request } from "../helper";

import Tabs from "@/components/Tabs.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import ActionsButtons from "@/components/ActionsButtons.vue";

import JsonEditor from "@/components/JsonEditor.vue";
import { addNotification } from "@/components/Notifications.vue";

import { itemStore, settingsStore } from "../store.js";
const items = itemStore();
const settings = settingsStore();

export default defineComponent({
    components: {
        JsonEditor,
        Tabs,
        EditorProperty,
        ActionsButtons
    },
    data() {
        return {
            editItem: null,
            browse: [{
                name: "Samsung TV",
                url: "/plugins/oh-plg-samsungtv-v1.0.0.tgz",
                author: "Marc Stirner",
                version: 1.0,
                description: "",
                intents: [
                    "ssdp",
                    "endpoints",
                    "devices"
                ]
            }, {
                name: "Pioneer/Onky eISCP",
                url: "",
                author: "Marc Stirner",
                version: 1.0,
                description: "",
                intents: [
                    "ssdp",
                    "endpoints",
                    "devices"
                ]
            }, {
                name: "Custom Lowboard driver",
                url: "",
                author: "Marc Stirner",
                version: 1.0,
                description: "",
                intents: []
            }, {
                name: "Phoscon/RaspBee ZigBee plugin",
                url: "/plugins/oh-plg-phoscon-v1.0.0.tgz",
                author: "Marc Stirner",
                version: 1.0,
                description: "",
                intents: [
                    "ssdp",
                    "endpoints",
                    "devices"
                ]
            }].map((plg) => {
                plg.description = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. 

Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. 

Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. 

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis. `;
                return plg;
            }),
            enabledEditFields: false,
            json: null
        };
    },
    computed: {
        plugins() {
            return items.plugins;
        },
        settings() {
            return settings;
        },
        tabItems() {

            let items = [{
                name: "Overview",
                id: "overview",
            }, {
                name: "Browse/Install",
                id: "browse"
            }];

            if (settings.expertSettings) {
                items.splice(1, 0, {
                    name: "Add",
                    id: "add",
                });
            }

            return items;

        }
    },
    methods: {
        triggerUpdate(item) {
            items.update("plugins", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Plugin "${item.name}" updated`, {
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
            items.remove("plugins", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Plugin "${item.name}" removed`, {
                        type: "success"
                    });

                    addNotification(`Restart the backend to apply changes!`, {
                        dismiss: false,
                        /*
                        actions: [{
                            title: "Restart now",
                            handler(event, notification) {

                                event.preventDefault();
                                event.stopPropagation();

                                alert("Restart now clicked");

                            }
                        }, {
                            title: "Later",
                            handler(event, { close }) {

                                event.preventDefault();
                                event.stopPropagation();
                                close();

                            }
                        }]
                        */
                    });

                }
            });
        },
        handleInfo() { },
        showInfo() { },
        handleStart(item) {

            request(`/api/plugins/${item._id}/start`, {
                method: "POST",
            }, (err) => {
                if (err || item.error) {

                    addNotification(`Error: ${err || item.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Plugin "${item.name}" started`, {
                        type: "success"
                    });

                }
            });

        },
        handleStop() { },
        handleRestart() { },
        handleJson(item) {
            this.json = item;
        },
        createIntentsArray(item) {
            return [
                "devices",
                "endpoints",
                "plugins",
                "rooms",
                "ssdp",
                "store",
                "users",
                "vault",
            ].map((intent) => {
                return {
                    name: intent,
                    value: intent,
                };
            });
        },
        fetchPlugins() {

            fetch(`https://plugins.open-haus.io/`, {
                mode: "no-cors",
                redirect: 'follow'
            }).then((resp) => {
                console.log(resp);
                return resp.json();
            }).then((data) => {
                this.browse = data;
            }).catch((err) => {
                console.warn("Could not fetch plugin list: " + err);
            });

        },
        installPlugin({ url, name, version, intents }) {

            console.log("Downmload url", url)

            fetch(url, {
                mode: 'no-cors',
                redirect: 'follow'
            }).then((resp) => {
                console.log("download file resp", resp);
                return resp.blob();
            }).then(async (blob) => {

                console.log("blob", blob)

                // create plugin item
                let data = await fetch("/api/plugins", {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        version,
                        intents
                    })
                }).then((resp) => {
                    return resp.json();
                });

                /*
                addNotification({
                  message: "Plugin item created",
                  type: "info",
                  showIcon: true,
                  dismiss: {
                    manually: true,
                    automatically: true,
                  },
                  showDurationProgress: true,
                  appearance: "dark",
                });
                */

                console.log("Plugin item created", data)

                // upload plugin content
                await fetch(`/api/plugins/${data._id}/files`, {
                    method: "PUT",
                    headers: {
                        "x-md5-checksum": "foo-bar-bz"
                    },
                    body: blob
                });

                /*
                addNotification({
                  message: "Plugin content upload created",
                  type: "info",
                  showIcon: true,
                  dismiss: {
                    manually: true,
                    automatically: true,
                  },
                  showDurationProgress: true,
                  appearance: "dark",
                });
                */

                addNotification(`Plugin "${data.name}" installed`, {
                    type: "success"
                });

            }).catch((err) => {
                console.log("Could not downadsfasdfasdfasdfasfdload file", err)

                addNotification(`Error: ${err}`, {
                    type: "danger",
                    dismiss: false
                });

            });

        },
        downloadPlugin(plg) {
            window.open(plg.url)
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
    mounted() {
        this.fetchPlugins();
    }
});
</script>


<template>
    <div>

        <JsonEditor v-if="!!json" :item="json" @onClose="onClose" @onConfirm="onConfirm" />

        <Tabs v-bind:items="tabItems">

            <!-- OVERVIEW-->
            <template v-slot:overview>
                <table class="table text-white">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Version</th>
                            <th scope="col">UUID</th>
                            <th scope="col">
                                Intents <span v-if="editItem">(Granted)</span>
                            </th>
                            <th scope="col" style="width: 10px">Autostart</th>
                            <th scope="col" style="width: 10px">Enabled</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="(item, index) in plugins">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>
                                <EditorProperty
                                    :enabled="item._id === editItem && settings.expertSettings && enabledEditFields"
                                    :object="item" prop="name" type="text" />
                            </td>
                            <td>
                                <EditorProperty
                                    :enabled="item._id === editItem && settings.expertSettings && enabledEditFields"
                                    :object="item" prop="version" type="text" />
                            </td>
                            <td>

                                <EditorProperty
                                    :enabled="item._id === editItem && settings.expertSettings && enabledEditFields"
                                    :object="item" prop="uuid" type="text" />
                            </td>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="intents"
                                    type="checkbox" :items="createIntentsArray(item)">
                                    <template v-slot:display>
                                        <ul style="padding-left: 1rem">
                                            <li v-bind:key="index" v-for="(intent, index) in item.intents">
                                                {{ intent }}
                                            </li>
                                        </ul>
                                    </template>
                                </EditorProperty>
                            </td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" :disabled="!item.enabled"
                                        v-bind:checked="item.autostart" v-model="item.autostart"
                                        @change.lazy="triggerUpdate(item)" />
                                </div>
                            </td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" v-bind:checked="item.enabled"
                                        v-model="item.enabled" v-on:click="item.autostart = false"
                                        @change.lazy="triggerUpdate(item)" />
                                </div>
                            </td>
                            <td>
                                <ActionsButtons :showEdit="true" :showRemove="true" :showInfo="true" :item="item"
                                    @handleEdit="handleEdit" @handleInfo="handleInfo" @handleRemove="handleRemove"
                                    @handleJson="handleJson">
                                    <template v-slot:custom>
                                        <button type="button" class="btn btn-outline-success" :disabled="!item.enabled"
                                            v-on:click="handleStart(item)" :class="{
                                                'text-muted': !item.enabled,
                                                'border-secondary': !item.enabled,
                                            }" v-tooltip:bottom="'Start Plugin'">
                                            <i class="fa-solid fa-power-off"></i>
                                        </button>
                                        <button type="button" class="btn btn-outline-danger hide"
                                            :disabled="!item.enabled" v-on:click="handleStop(item)" :class="{
                                                'text-muted': !item.enabled,
                                                'border-secondary': !item.enabled,
                                            }" v-tooltip:bottom="'Stop Plugin'">
                                            <i class="fa-solid fa-power-off"></i>
                                        </button>
                                        <button type="button" class="btn btn-outline-warning hide"
                                            :disabled="!item.enabled" v-on:click="handleRestart(item)" :class="{
                                                'text-muted': !item.enabled,
                                                'border-secondary': !item.enabled,
                                            }" v-tooltip:bottom="'Restart Plugin'">
                                            <i class="fa-solid fa-arrow-rotate-right"></i>
                                        </button>
                                    </template>
                                </ActionsButtons>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
            <!-- OVERVIEW-->

            <!-- ADD -->
            <template v-slot:add>

                <div>
                    <div class="row">
                        <div class="col-6">
                            <form @submit.prevent="addItem">
                                <div class="form-group mb-2">
                                    <label>Name</label>
                                    <input type="text" name="name" class="form-control bg-dark text-white" />
                                </div>
                                <div class="form-group mb-2">
                                    <label>Version</label>
                                    <input type="number" name="version" class="form-control bg-dark text-white" />
                                </div>
                                <div class="form-group mb-2">
                                    <label>UUID</label>
                                    <input type="number" name="uuid" class="form-control bg-dark text-white" />
                                </div>
                                <div class="form-group mb-2">
                                    <label>Intents</label>
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
            <!-- ADD -->

            <!-- BROWSE/INSTALL-->
            <template v-slot:browse>
                <table class="table text-white">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Author</th>
                            <th scope="col">Version</th>
                            <th scope="col">Description</th>
                            <th scope="col">Intents</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="index" v-for="(plugin, index) in browse">
                            <td>{{ plugin.name }}</td>
                            <td>{{ plugin.author }}</td>
                            <td>{{ plugin.version }}</td>
                            <td>

                                <textarea v-bind:value="plugin.description" readonly="true" rows="5"
                                    class="w-100 text-white border-0"
                                    style="background-color: transparent; resize: none;">
                </textarea>
                            </td>
                            <td>
                                <ul class="ps-3">
                                    <li v-bind:key="index" v-for="(intent, index) in plugin.intents">
                                        {{ intent }}
                                    </li>
                                </ul>
                            </td>
                            <td>
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-outline-success"
                                        v-tooltip:bottom="'Install Plugin'" @click="installPlugin(plugin)">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary"
                                        v-tooltip:bottom="'Download Plugin'" @click="downloadPlugin(plugin)">
                                        <i class="fa-solid fa-download"></i>
                                    </button>

                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
            <!-- BROWSE/INSTALL-->

        </Tabs>

        <!--plugins: {{ plugins }}-->
    </div>
</template>

<style scoped></style>