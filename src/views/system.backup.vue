<script setup>
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
import { defineComponent } from 'vue';

import Tabs from "@/components/Tabs.vue";
import Modal from "@/components/Modal.vue";
import { addNotification } from "@/components/Notifications.vue";
import { request } from "../helper.js";

export default defineComponent({
    components: {
        Tabs,
        Modal
    },
    data() {
        return {
            tabItems: [{
                name: "Export",
                id: "export",
            }, {
                name: "Import",
                id: "import",
            }],
            exportData: {
                includes: ["database", "plugins", "env"],
                encrypt: false,
                encode: true,
                showModal: false,
                keys: {
                    key: null,
                    iv: null
                }
            },
            importData: {
                restore: [],
                encrypt: false,
                decode: true,
                truncate: true,
                skipDuplicates: true,
                showModal: false,
                fileBuffer: null,
                keys: {
                    key: null,
                    iv: null
                }
            }
        };
    },
    methods: {
        handleCloseExport() {
            this.exportData.keys = {
                key: null,
                iv: null
            }
            this.exportData.showModal = false;
        },
        download() {

            let { encrypt, includes, encode } = this.exportData;
            let query = `encrypt=${encrypt}&encode=${encode}&`;

            query += includes.map((intent) => {
                return `includes[]=${intent}`;
            }).join("&");


            // TODO: switch to request
            request(`/api/system/backup/export?${query}`, {
                method: "POST",
                headers: {
                    "content-type": "application/octet-stream"
                }
            }).then(res => {

                console.log("headers", res.headers)

                if (encrypt) {
                    this.exportData.keys.key = res.headers.get("x-encryption-key");
                    this.exportData.keys.iv = res.headers.get("x-encryption-iv");
                    this.exportData.showModal = true;
                }

                return res;

            }).then(blob => {

                let blobUrl = URL.createObjectURL(blob);
                let a = document.createElement("a");

                a.href = blobUrl;
                a.download = `OpenHaus-${Date.now()}.tgz`;
                document.body.appendChild(a);
                a.click();

                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);

                addNotification("Backup file download", {
                    type: "success"
                });

            });

        },
        handleFileUpload() {
            if (this.importData.fileBuffer) {

                let { encrypt, decode, truncate, skipDuplicates, restore, keys } = this.importData;
                let query = `encrypt=${encrypt}&decode=${decode}&truncate=${truncate}&skipDuplicates=${skipDuplicates}`;

                /*
                // TODO: to be implmeented in the backend
                query += restore.map((intent) => {
                    return `includes[]=${intent}`;
                }).join("&");
                */

                let headers = {
                    "content-type": "application/octet-stream",
                    // TODO: set decrpty header values
                };

                if (this.importData.encrypt) {
                    headers["x-encryption-key"] = keys.key;
                    headers["x-encryption-iv"] = keys.iv;
                }

                request(`/api/system/backup/import?${query}`, {
                    method: "POST",
                    headers,
                    body: this.importData.fileBuffer,
                }).then(() => {

                    this.importData.fileBuffer = null;
                    this.importData.keys.iv = null;
                    this.importData.keys.key = null;

                    addNotification("Restore completed<br />Restart the application to apply changes", {
                        type: "success"
                    });

                }).catch((err) => {

                    console.error("error restoring:", err)

                    addNotification(`Restore failed!<br />Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                });

            } else {

                console.warn("No backup file content available");

            }
        },
        handleFileChange(event) {

            const file = event.target.files[0];

            if (file) {

                const reader = new FileReader();

                reader.onload = () => {

                    const fileContent = reader.result;
                    this.importData.fileBuffer = fileContent;

                    console.log('Dateiinhalt:', fileContent);

                    //this.uploadFile(fileContent);
                    // TODO: check if encrypted or not/read header/first few bytes "magic number"

                    if (this.importData.encrypt) {
                        this.importData.showModal = true;
                    } else {
                        this.handleFileUpload();
                    }

                };

                reader.readAsArrayBuffer(file);

            }
        },
        upload() {
            this.$refs.fileInput.click();
        },
        handleCloseImport() {
            this.importData.showModal = false;
            this.handleFileUpload();
        }
    }
});
</script>

<template>
    <Tabs v-bind:items="tabItems">

        <!-- EXPORT -->
        <template v-slot:export>

            <Modal :visible="exportData.showModal" :title="'Encryption keys'">
                <template v-slot:body>

                    <div class="alert alert-danger" role="alert">
                        <h5 class="text-danger text-decoration-underline">Warning!</h5>
                        Store these keys/values somehwere.<br>
                        Or else you cant decrypt/import the backup!<br />
                        This message cant be displayed again.
                    </div>

                    IV: {{ exportData.keys.iv }}<br />
                    KEY: {{ exportData.keys.key }}

                </template>
                <template v-slot:footer>
                    <button type="button" class="btn btn-outline-secondary" @click="handleCloseExport">Close</button>
                </template>
            </Modal>

            <div class="form-check form-switch" v-if="settings.expertSettings">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="exportData.encode" />
                    Encode .env values
                </label>
            </div>

            <div class="form-check form-switch">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="exportData.encrypt" />
                    Encrypt *.tgz archive
                </label>
            </div>

            <hr />

            <div class="form-check form-switch" v-if="settings.expertSettings">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="exportData.includes" value="database" />
                    Include Database
                </label>
            </div>

            <div class="form-check form-switch" v-if="settings.expertSettings">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="exportData.includes" value="plugins" />
                    Include Plugins files
                </label>
            </div>

            <div class="form-check form-switch" v-if="settings.expertSettings">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="exportData.includes" value="env" />
                    Include .env file
                </label>
            </div>

            <button class="btn btn-outline-primary" @click="download">Download</button>

        </template>
        <!-- EXPORT -->

        <!-- IMPORT -->
        <template v-slot:import>

            <Modal :visible="importData.showModal" :title="'Encryption keys'">
                <template v-slot:body>

                    <div class="mb-3">
                        <label class="form-label">IV:</label>
                        <input type="text" class="form-control" v-model="importData.keys.iv">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">KEY:</label>
                        <input type="text" class="form-control" v-model="importData.keys.key">
                    </div>

                </template>
                <template v-slot:footer>
                    <button type="button" class="btn btn-outline-primary" @click="handleCloseImport">Save</button>
                </template>
            </Modal>

            <input type="file" ref="fileInput" class="hide" @change="handleFileChange">

            <div class="form-check form-switch" v-if="settings.expertSettings">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="importData.decode" />
                    Decode .env values
                </label>
            </div>

            <div class="form-check form-switch" v-if="settings.expertSettings">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="importData.truncate" />
                    Truncate database & files (tabula rasa)
                </label>
            </div>

            <div class="form-check form-switch" v-if="settings.expertSettings">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="importData.skipDuplicates" />
                    Skip duplicates (Skip same databse _id items)
                </label>
            </div>

            <hr />

            <div class="form-check form-switch">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="importData.encrypt" />
                    Decrypt (backup is encrypted)
                </label>
            </div>

            <button class="btn btn-outline-primary" @click="upload">Upload</button>

        </template>
        <!-- IMPORT -->

    </Tabs>
</template>
