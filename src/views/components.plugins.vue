<script>
import { defineComponent } from "vue";
import { request, calculateSHA256 } from "../helper";

import Tabs from "@/components/Tabs.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import ActionsButtons from "@/components/ActionsButtons.vue";
import Modal from "@/components/Modal.vue";

import JsonEditor from "@/components/JsonEditor.vue";
import { addNotification } from "@/components/Notifications.vue";

import semver from "semver";

import { itemStore, settingsStore } from "../store.js";
const items = itemStore();
const settings = settingsStore();

export default defineComponent({
    components: {
        JsonEditor,
        Tabs,
        EditorProperty,
        ActionsButtons,
        Modal
    },
    data() {
        return {
            editItem: null,
            browse: [],
            enabledEditFields: false,
            json: null,
            installModal: {
                show: false,
                data: {}
            }
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

            // disabled, even needed?!
            if (settings.expertSettings && false) {
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
        createIntentsArray() {
            return [
                "devices",
                "endpoints",
                "mdns",
                "mqtt",
                "plugins",
                "rooms",
                "scenes",
                "ssdp",
                "store",
                "users",
                "vault",
                "webhoooks"
            ].map((intent) => {
                return {
                    name: intent,
                    value: intent,
                };
            });
        },
        fetchPluginList() {
            fetch(`https://plugins.open-haus.io/`, {
                redirect: "follow"
            }).then((resp) => {
                return resp.json();
            }).then((data) => {

                console.log("Plugin data", data)

                this.browse = data.map((obj) => {

                    //let releases = this.sortVersions(obj);

                    let item = this.plugins.find((item) => {
                        return item.uuid === obj.uuid;
                    });

                    if (item) {
                        obj.version = item.version;
                    }

                    //obj.version = releases[0].version;
                    obj.actionType = "install";

                    return obj;

                });

            }).catch((err) => {
                console.warn("Could not fetch plugin list: " + err);
            });
        },
        async fetchPluginFileContent(plugin) {
            try {

                let { file = null } = plugin.releases.find(({ version }) => {
                    return plugin.version === version;
                });

                if (!file) {
                    console.warn("File/version not found in release array");
                    return null;
                }

                let response = await fetch(`https://plugins.open-haus.io/files/${file}`, {
                    redirect: "follow"
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch file: ${response.statusText}`);
                }

                return await response.blob();

            } catch (err) {

                console.warn("Could not fetch plugin file: " + err);

                addNotification(`Error: ${err}`, {
                    type: "danger",
                    dismiss: false
                });

                return null;

            }
        },
        async installPlugin(plugin) {

            console.log("Download plugin", plugin);

            let { close } = addNotification(`Download plugin "${plugin.name}"...`);

            let release = plugin.releases.find(({ version }) => {
                return plugin.version === version;
            });

            let content = await this.fetchPluginFileContent(plugin);
            let sha265 = await calculateSHA256(content);

            console.log("File content", content, sha265 === release.checksum);

            this.installModal.data = {
                plugin,
                sha265,
                content,
                release
            };

            this.installModal.show = true;
            close();

        },
        downloadPlugin(plugin) {

            let { file = null } = plugin.releases.find(({ version }) => {
                return plugin.version === version;
            });

            if (!file) {
                console.warn("File/version not found in release array");
                return;
            }

            window.open(`https://plugins.open-haus.io/files/${file}`);

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
        handleInstallClose() {
            this.installModal.data = null;
            this.installModal.show = false;
        },
        async handleInstallConfirm() {
            return new Promise((resolve, reject) => {

                console.log("Handle put request,")

                let { name, intents, uuid, version } = this.installModal.data.plugin;
                let body = this.installModal.data.content;

                request("/api/plugins", {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        intents,
                        uuid,
                        version
                    })
                })/*.then((resp) => {

                    if (!resp.ok) {
                        throw new Error('Fehler beim Updaten des Plugins');
                    }

                    return resp.json();

                })*/.then((item) => {

                    return request(`/api/plugins/${item._id}/files?install=true`, {
                        method: "PUT",
                        headers: {
                            "content-type": "application/octet-stream"
                        },
                        body
                    });

                })/*.then((resp) => {

                    console.log("resp", resp)

                    if (!resp.ok) {
                        throw new Error('Fehler beim Hochladen der Plugin-Dateien');
                    }

                    return resp.json();

                })*/.then((item) => {

                    console.log("Plugin installed", item);

                    addNotification(`Plugin "${item.name}" v${item.version} installed!<br />Start the plugin to apply changes`, {
                        type: "success",
                        dismiss: false
                    });

                    this.installModal.data = null;
                    this.installModal.show = false;

                    resolve(item);

                }).catch((err) => {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                    reject(err);

                });
            });
        },
        isPluginInstalled(plg) {

            return !!this.plugins.find((item) => {
                return item.uuid === plg.uuid;
            });

        },
        isVersionInstalled(plg) {

            let item = this.plugins.find((item) => {
                return item.uuid === plg.uuid;
            });

            if (!item) {
                return false;
            }

            return item.version === plg.version;

        },
        sortVersions(releases) {
            return releases.sort((a, b) => {

                const parseVersion = (version) => version.split('.').map(Number);

                const [majorA, minorA, patchA] = parseVersion(a.version);
                const [majorB, minorB, patchB] = parseVersion(b.version);

                if (majorA !== majorB) return majorB - majorA;
                if (minorA !== minorB) return minorB - minorA;

                return patchB - patchA;

            });
        },
        updateAvailable(plg) {

            let item = this.plugins.find((item) => {
                return item.uuid === plg.uuid;
            });

            // sort highes avaiable release version
            let releases = this.sortVersions(plg.releases);

            if (item && semver.gt(releases[0].version, item?.version)) {
                return true;
            }

            return false;

        },
        versionChanged(plg) {

            let item = this.plugins.find((item) => {
                return item.uuid === plg.uuid;
            });

            if (!item) {
                plg.actionType = "install";
                return;
            }

            if (semver.gt(plg.version, item.version)) {
                plg.actionType = "update";
            } else if (semver.lt(plg.version, item.version)) {
                plg.actionType = "downgrade";
            } else {
                plg.actionType = "install";
            }

            console.log("Plugin versio changed")

        },
        async changeVersion(plg) {

            let item = this.plugins.find((item) => {
                return item.uuid === plg.uuid;
            });

            await this.installPlugin(plg);
            this.installModal.show = false;

            await request(`/api/plugins/${item._id}/files`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json"
                }
            });

            await request(`/api/plugins/${item._id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    version: plg.version
                })
            });

            await this.handleInstallConfirm();

        }
    },
    mounted() {
        this.fetchPluginList();
    }
});
</script>


<template>
    <div>

        <JsonEditor v-if="!!json" :item="json" @onClose="onClose" @onConfirm="onConfirm" />

        <Modal :visible="installModal.show" title="Install Plugin" @close="handleInstallClose"
            @confirm="handleInstallConfirm">
            <template #body>

                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <div class="input-group">
                        <input type="text" class="form-control bg-dark text-secondary"
                            v-model="installModal.data.plugin.name" :readonly="!settings.expertSettings">
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Version</label>
                    <div class="input-group">
                        <input type="text" class="form-control bg-dark text-secondary"
                            v-model="installModal.data.plugin.version" :readonly="!settings.expertSettings">
                    </div>
                </div>

                <!--
                <div class="mb-3">
                    <label class="form-label">Author</label>
                    <div class="input-group">
                        <input type="text" class="form-control bg-dark text-secondary"
                            v-model="installModal.data.plugin.author" :readonly="!settings.expertSettings">
                    </div>
                </div>
                -->

                <div class="mb-3">
                    <label class="form-label">UUID</label>
                    <div class="input-group">
                        <input type="text" class="form-control bg-dark text-secondary"
                            v-model="installModal.data.plugin.uuid" :readonly="!settings.expertSettings">
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <div class="input-group">
                        <textarea type="text" class="form-control bg-dark text-secondary"
                            v-bind:value="installModal.data.plugin.description" rows="5"
                            :readonly="!settings.expertSettings">
                        </textarea>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        Checksum (SHA-256)
                        <span class="badge bg-success"
                            v-if="installModal.data.release.checksum === installModal.data.sha265">
                            Verified
                        </span>
                        <span class="badge bg-danger" v-else>
                            Invalid
                        </span>
                    </label>
                    <div class="input-group">
                        <input type="text" class="form-control bg-dark text-secondary"
                            v-model="installModal.data.release.checksum" readonly>
                    </div>
                </div>

                <!--
                <div class="mb-3">
                    <label class="form-label">Intents</label>
                    <div class="input-group">
                        <ul>
                            <li v-for="intent in installModal.data.plugin.intents">
                                {{ intent }}
                            </li>
                        </ul>
                    </div>
                </div>
            -->
                <div class="mb-3">
                    <label class="form-label">Intents</label>
                    <EditorProperty :enabled="settings.expertSettings" :object="installModal.data.plugin" prop="intents"
                        type="checkbox" :items="createIntentsArray()">
                        <template v-slot:display>
                            <ul style="padding-left: 1rem">
                                <li v-bind:key="index" v-for="(intent, index) in installModal.data.plugin.intents">
                                    {{ intent }}
                                </li>
                            </ul>
                        </template>
                    </EditorProperty>
                </div>

            </template>
        </Modal>

        <Tabs v-bind:items="tabItems">

            <!-- OVERVIEW-->
            <template v-slot:overview>
                <table class="table text-white">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Version</th>
                            <th scope="col" v-if="settings.expertSettings">UUID</th>
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
                            <td v-if="settings.expertSettings">

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
                                            }" tooltip="Start Plugin" flow="down">
                                            <i class="fa-solid fa-power-off"></i>
                                        </button>
                                        <button type="button" class="btn btn-outline-danger hide"
                                            :disabled="!item.enabled" v-on:click="handleStop(item)" :class="{
                                                'text-muted': !item.enabled,
                                                'border-secondary': !item.enabled,
                                            }" tooltip="Stop Plugin" flow="down">
                                            <i class="fa-solid fa-power-off"></i>
                                        </button>
                                        <button type="button" class="btn btn-outline-warning hide"
                                            :disabled="!item.enabled" v-on:click="handleRestart(item)" :class="{
                                                'text-muted': !item.enabled,
                                                'border-secondary': !item.enabled,
                                            }" tooltip="Restart Plugin" flow="down">
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
                            <th scope="col">Version</th>
                            <th scope="col">Website</th>
                            <th scope="col">Description</th>
                            <th scope="col">Intents</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="index" v-for="(plugin, index) in browse">
                            <td>
                                <div>
                                    {{ plugin.name }}
                                </div>
                                <div>
                                    <span class="badge badge-outline badge-success me-1"
                                        v-if="isPluginInstalled(plugin)">
                                        Installed
                                    </span>
                                    <span class="badge badge-outline badge-warning me-1 hide">
                                        Singed
                                    </span>
                                    <span class="badge badge-outline badge-warning me-1 hide">
                                        Verified
                                    </span>
                                    <span class="badge badge-outline badge-primary me-1" v-if="updateAvailable(plugin)">
                                        Update Available
                                    </span>
                                </div>
                            </td>
                            <td>
                                <select class="form-select w-auto" v-model="plugin.version"
                                    @change="versionChanged(plugin)">
                                    <option v-for="release in sortVersions(plugin.releases)">
                                        {{ release.version }}
                                    </option>
                                </select>
                            </td>
                            <td>
                                <a :href="plugin.website" target="_blank" class="icon-link">
                                    Website
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            </td>
                            <td>
                                <textarea v-bind:value="plugin.description" readonly="true" rows="5"
                                    class="form-control w-100 text-white border-0 p-1"
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

                                    <button type="button" class="btn btn-outline-success" tooltip="Install Plugin"
                                        flow="down" :disabled="isPluginInstalled(plugin)"
                                        v-if="plugin.actionType === 'install'" @click="installPlugin(plugin)">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                    <button class="btn btn-outline-primary" v-if="plugin.actionType === 'update'"
                                        @click="changeVersion(plugin)" :disabled="isVersionInstalled(plugin)"
                                        tooltip="Update Plugin" flow="down">
                                        <i class="fa-solid fa-arrow-up"></i>
                                    </button>
                                    <button class="btn btn-outline-primary" v-if="plugin.actionType === 'downgrade'"
                                        @click="changeVersion(plugin)" :disabled="isVersionInstalled(plugin)"
                                        tooltip="Downgrade Plugin" flow="down">
                                        <i class="fa-solid fa-arrow-down"></i>
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary" tooltip="Download Plugin"
                                        flow="down" @click="downloadPlugin(plugin)">
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

<style scoped>
a.icon-link i.fa-solid {
    font-size: 8px;
}
</style>