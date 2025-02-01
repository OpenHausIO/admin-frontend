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
import JsonEditor from "@/components/JsonEditor.vue";
import Modal from "@/components/Modal.vue";

import { request } from "../helper";
import { addNotification } from "@/components/Notifications.vue";

import { itemStore } from "../store.js";
const items = itemStore();

export default defineComponent({
    components: {
        ActionsButtons,
        EditorProperty,
        JsonEditor,
        Tabs,
        Modal
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
            secretsModalShow: false,
            secretsModalItem: null,

            secretsModal: {
                secrets: [],
                show: false,
                item: null
            }

        };
    },
    computed: {
        vault() {
            return items.vault;
        },
    },
    methods: {
        triggerUpdate(item) {
            items.update("vault", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Vault "${item.name}" updated`, {
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
            items.remove("vault", item, (err) => {
                if (err) {

                    addNotification(`Error: ${err}`, {
                        type: "danger",
                        dismiss: false
                    });

                } else {

                    addNotification(`Vault "${item.name}" removed`, {
                        type: "success"
                    });

                }
            });
        },
        handleAdd() { },
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
        onCloseSecretsModal() {
            console.log("Close secrets modal")
            this.secretsModal.show = false;
            this.secretsModal.item = null;
            this.secretsModal.secrets = [];
        },
        showSecretsModal(item) {

            this.secretsModal.item = item;
            this.secretsModal.show = true;

            this.secretsModal.secrets = item?.secrets.map(({ _id, value, name, key, description }) => {
                return {
                    _id,
                    value: Date.now(),
                    name,
                    key,
                    visible: false,
                    description
                };
            });

        },
        async decryptSecret(secret) {
            try {

                let { _id } = this.secretsModal.item;
                let { value } = await request(`/api/vault/${_id}/secrets/${secret._id}/decrypt`, {
                    method: "POST"
                });

                secret.visible = true;
                secret.value = value;

                return value;

            } catch (err) {

                addNotification(`Could not decrypt secret "${secret.name}"<br />Error: ${err.message}`, {
                    type: "danger",
                    dismiss: false
                });

                secret.visible = true;
                secret.value = value;

            }
        },
        decryptSecretsModal() {

            // do http request
            // patch/overide secrets in array
            // set visible to true

            console.log("Decrypt values");

            let { _id } = this.secretsModal.item;

            let requests = this.secretsModal.secrets.map((secret) => {
                return request(`/api/vault/${_id}/secrets/${secret._id}/decrypt`, {
                    method: "POST"
                });
            });

            Promise.all(requests).then((decrypted) => {
                this.secretsModal.secrets.forEach((secret, i) => {
                    secret.value = decrypted[i].value;
                    secret.visible = true;
                });
            }).catch((err) => {

                addNotification(`Could not decrypt secrets<br />Error: ${err.message}`, {
                    type: "danger",
                    dismiss: false
                });

            });

        },
        saveSecretValues() {

            let changed = this.secretsModal.secrets.filter(({ visible }) => {
                return visible;
            });

            let requests = changed.map((secret, index) => {

                console.log("save secret", index, secret)

                let { _id } = this.secretsModal.item;

                return request(`/api/vault/${_id}/secrets/${secret._id}/encrypt`, {
                    method: "POST",
                    body: JSON.stringify({
                        value: secret.value
                    })
                });

            });

            Promise.all(requests).then(() => {

                addNotification(`Secrets saved!`, {
                    type: "success"
                });

                changed.forEach((secret) => {
                    secret.visible = false;
                    secret.value = Date.now();
                });

            }).catch((err) => {

                addNotification(`Could not set secret(s)<br />Error: ${err.message}`, {
                    type: "danger",
                    dismiss: false
                });

            });

        }

    }
});
</script>


<template>
    <div>

        <JsonEditor v-if="!!json" :item="json" @onClose="onClose" @onConfirm="onConfirm" />

        <Modal v-if="!!secretsModal.show" :visible="secretsModal.show" title="Secrets" @close="onCloseSecretsModal"
            @confirm="saveSecretValues">
            <template #body>

                <div class="mb-3" v-for="secret in secretsModal.secrets">
                    <label for="inputWithButton" class="form-label">{{ secret.name }}</label>
                    <div class="input-group">
                        <input :type="secret.visible ? 'text' : 'password'" class="form-control bg-dark text-white"
                            v-model="secret.value" :readonly="!secret.visible">
                        <button class="btn btn-outline-secondary" type="button" @click="decryptSecret(secret)"
                            tooltip="Decrypt/Edit" flow="left">
                            <i class="fa-solid fa-unlock-keyhole"></i>
                        </button>
                    </div>
                    <div class="form-text fst-italic">
                        {{ secret.description || secret.key }}
                    </div>
                </div>

            </template>
        </Modal>

        <Tabs v-bind:items="tabItems">
            <template v-slot:overview>
                <table class="table text-white">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Timestamps</th>
                            <th scope="col" style="width: 10px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-bind:key="item._id" v-for="(item, index) in vault">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>
                                <EditorProperty :enabled="item._id === editItem" :object="item" prop="name"
                                    type="text" />
                            </td>
                            <td>

                                <table>
                                    <tr>
                                        <td>Created:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.created, settings.dateformat) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Updated:</td>
                                        <td>
                                            {{ dateFormat(item.timestamps.updated, settings.dateformat) }}
                                        </td>
                                    </tr>
                                </table>


                            </td>
                            <td>
                                <ActionsButtons :showEdit="true" :showRemove="true" :item="item"
                                    @handleEdit="handleEdit" @handleRemove="handleRemove" @handleJson="handleJson">
                                    <template v-slot:custom>
                                        <button type="button" class="btn btn-outline-secondary" tooltip="Show secrets"
                                            flow="down" @click="showSecretsModal(item)">
                                            <i class="fa-solid fa-lock"></i>
                                        </button>
                                    </template>
                                </ActionsButtons>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
            <template v-slot:add> Hello from apsdflkasjfdlasdf </template>
        </Tabs>

        <!--vault: {{ vault }}-->
    </div>
</template>
