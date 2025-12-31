<script setup>
import dateFormat from "dateformat";
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
import { defineComponent } from "vue";
import Modal from "@/components/Modal.vue";

export default defineComponent({
    components: {
        Modal
    },
    data() {
        return {
            modal: {
                show: false
            },
            includes: []
        };
    },
    methods: {
        onPrune() {

            console.log("Do http prune request", this.includes)
            this.modal.show = false;

        }
    }
});
</script>


<template>
    <div>

        <Modal v-if="!!modal.show" :visible="modal.show" title="Secrets">
            <template #body>

                Are you sure you want to prune the system?
                <hr />

                {{ includes }}

            </template>
            <template #footer>

                <button type="button" class="btn btn-outline-secondary" @click="modal.show = false">Close</button>
                <button type="button" class="btn btn-outline-danger" @click="onPrune">Prune</button>

            </template>
        </Modal>

        <div class="form-check form-switch">

            <label>
                Components
                <input class="form-check-input" type="checkbox" v-model="includes" value="components" />

            </label>

        </div>

        <hr />


        <div class="container-fluid">
            <div class="row">

                <div class="col">

                    <div class="form-check form-switch">
                        <label>
                            Devices
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/devices" />
                        </label>
                    </div>

                    <div class="form-check form-switch">
                        <label>
                            Endpoints
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/endpoints" />
                        </label>
                    </div>

                    <div class="form-check form-switch">
                        <label>
                            MDNS
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/mdns" />
                        </label>
                    </div>

                    <div class="form-check form-switch">
                        <label>
                            SSDP
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/ssdp" />
                        </label>
                    </div>

                </div>

                <div class="col">

                    <div class="form-check form-switch">
                        <label>
                            Devices
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/devices" />
                        </label>
                    </div>

                    <div class="form-check form-switch">
                        <label>
                            Endpoints
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/endpoints" />
                        </label>
                    </div>

                    <div class="form-check form-switch">
                        <label>
                            MDNS
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/mdns" />
                        </label>
                    </div>

                    <div class="form-check form-switch">
                        <label>
                            SSDP
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/ssdp" />
                        </label>
                    </div>

                </div>

                <div class="col">

                    <div class="form-check form-switch">
                        <label>
                            Devices
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/devices" />
                        </label>
                    </div>

                    <div class="form-check form-switch">
                        <label>
                            Endpoints
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/endpoints" />
                        </label>
                    </div>

                    <div class="form-check form-switch">
                        <label>
                            MDNS
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/mdns" />
                        </label>
                    </div>

                    <div class="form-check form-switch">
                        <label>
                            SSDP
                            <input class="form-check-input" type="checkbox" v-model="includes"
                                value="components/ssdp" />
                        </label>
                    </div>

                </div>

            </div>
        </div>


        <div class="form-check form-switch">
            <label>
                <input class="form-check-input" type="checkbox" v-model="includes" value="logfiles" />
                Logfiles
            </label>
        </div>

        <div class="form-check form-switch">
            <label>
                <input class="form-check-input" type="checkbox" v-model="includes" value="env" />
                .env
            </label>
        </div>

        <button class="btn btn-outline-danger" @click="modal.show = true">Prune</button>


    </div>
</template>
